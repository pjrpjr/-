"""Generate OpenAPI schema for the FastAPI mock service."""

from pathlib import Path
import json
import sys

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi.openapi.utils import get_openapi  # type: ignore

from app.main import app


def main() -> None:
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    output_path = BASE_DIR / "docs" / "openapi-platform-mock.json"
    output_path.write_text(json.dumps(schema, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OpenAPI schema written to {output_path}")


if __name__ == "__main__":
    main()
