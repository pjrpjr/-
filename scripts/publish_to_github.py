# -*- coding: utf-8 -*-
import argparse
import json
import os
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib import error, request
from urllib.parse import quote


def github_request(method: str, url: str, token: str, payload=None):
    headers = {
        "User-Agent": "codex-cli-publisher",
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
    }
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = request.Request(url, data=data, method=method, headers=headers)
    try:
        with request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            return resp.getcode(), json.loads(body) if body else None
    except error.HTTPError as exc:
        detail_raw = exc.read().decode("utf-8", "replace")
        try:
            detail = json.loads(detail_raw)
        except json.JSONDecodeError:
            detail = detail_raw
        return exc.code, detail


def ensure_repo(token: str, repo_name: str):
    status, user_info = github_request("GET", "https://api.github.com/user", token)
    if status != 200:
        raise RuntimeError(f"Failed to fetch GitHub user info ({status}): {user_info}")
    login = user_info.get("login")
    if not login:
        raise RuntimeError("GitHub token did not return a login field; cannot determine username")

    repo_url = f"https://api.github.com/repos/{login}/{quote(repo_name)}"
    status, repo_info = github_request("GET", repo_url, token)
    if status == 404:
        status, repo_info = github_request(
            "POST",
            "https://api.github.com/user/repos",
            token,
            {"name": repo_name},
        )
        if status not in (200, 201):
            raise RuntimeError(f"Failed to create repo {repo_name} ({status}): {repo_info}")
    elif status != 200:
        raise RuntimeError(f"Failed to fetch repo {repo_name} ({status}): {repo_info}")

    clone_url = repo_info.get("clone_url") if isinstance(repo_info, dict) else None
    if not clone_url:
        clone_url = f"https://github.com/{login}/{quote(repo_name)}.git"
    return login, clone_url


def run_git(repo_root: Path, *args, check: bool = True, env=None):
    result = subprocess.run(
        ["git", *args],
        cwd=repo_root,
        capture_output=True,
        text=True,
        check=False,
        encoding="utf-8",
        env=env,
    )
    if check and result.returncode != 0:
        message = result.stderr.strip() or result.stdout.strip()
        raise RuntimeError(f"git {' '.join(args)} failed: {message}")
    return result


def stage_and_commit(repo_root: Path):
    run_git(repo_root, "add", "-A")
    status = run_git(repo_root, "status", "--porcelain", check=False)
    if not status.stdout.strip():
        return None
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S %Z")
    message = f"Auto snapshot {timestamp}"
    run_git(repo_root, "commit", "-m", message)
    return message


def configure_remote(repo_root: Path, remote_name: str, remote_url: str):
    current = run_git(repo_root, "remote", "get-url", remote_name, check=False)
    if current.returncode == 0:
        return current.stdout.strip()
    run_git(repo_root, "remote", "add", remote_name, remote_url)
    return remote_url


def push(repo_root: Path, remote_name: str, token: str):
    env = os.environ.copy()
    env.pop("GIT_ASKPASS", None)
    env.pop("GIT_PASSWORD", None)
    env.pop("GIT_USERNAME", None)
    env["GIT_PASSWORD"] = token
    with tempfile.NamedTemporaryFile("w", delete=False, suffix=".cmd") as tmp:
        tmp.write("@echo %GIT_PASSWORD%\\n")
        askpass_path = tmp.name
    try:
        env["GIT_ASKPASS"] = askpass_path
        env["GIT_TERMINAL_PROMPT"] = "0"
        result = run_git(repo_root, "push", remote_name, "HEAD", check=False, env=env)
        if result.returncode != 0:
            message = result.stderr.strip() or result.stdout.strip()
            raise RuntimeError(f"git push failed: {message}")
    finally:
        Path(askpass_path).unlink(missing_ok=True)


def read_token(token_path: Path) -> str:
    raw = token_path.read_bytes()
    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            decoded = raw.decode(encoding)
        except UnicodeDecodeError:
            continue
        decoded = decoded.strip()
        if not decoded:
            continue
        lines = [line.strip() for line in decoded.replace("\r", "\n").splitlines() if line.strip()]
        if not lines:
            continue
        candidate = lines[-1].split()[-1]
        if candidate:
            return candidate
    raise SystemExit("Unable to decode GitHub token from file")


def main():
    parser = argparse.ArgumentParser(description="Auto-commit and push to GitHub")
    parser.add_argument("--repo-name", default="\u7f51\u9875\u5f00\u53d1", help="GitHub repository name (default: 网页开发)")
    parser.add_argument("--token-path", default="githubtoken.md", help="Path to the GitHub token file")
    parser.add_argument("--remote-name", default="origin", help="Git remote name (default: origin)")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    token_path = repo_root / args.token_path
    if not token_path.exists():
        raise SystemExit(f"Token file not found: {token_path}")
    token = read_token(token_path)
    if not token:
        raise SystemExit("Token file is empty; cannot continue")

    login, clone_url = ensure_repo(token, args.repo_name)
    remote_url = clone_url.replace("https://", f"https://{login}@")
    configure_remote(repo_root, args.remote_name, remote_url)

    commit_message = stage_and_commit(repo_root)
    if commit_message is None:
        print("No changes detected; skipping push.")
        return

    push(repo_root, args.remote_name, token)
    print(f"Pushed latest commit: {commit_message}")
    print(f"Repository URL: https://github.com/{login}/{args.repo_name}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        sys.stderr.buffer.write(f"[ERROR] {exc}\n".encode("utf-8", "replace"))
        sys.stderr.flush()
        sys.exit(1)
