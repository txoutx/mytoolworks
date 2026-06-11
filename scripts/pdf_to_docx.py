from pathlib import Path
from sys import argv, stderr, exit

from pdf2docx import Converter


def main() -> int:
    if len(argv) != 3:
        print("Uso: python scripts/pdf_to_docx.py entrada.pdf salida.docx", file=stderr)
        return 2

    source = Path(argv[1]).resolve()
    target = Path(argv[2]).resolve()

    if not source.exists() or source.suffix.lower() != ".pdf":
        print("El archivo de entrada debe ser un PDF existente.", file=stderr)
        return 2

    target.parent.mkdir(parents=True, exist_ok=True)
    converter = Converter(str(source))
    try:
        converter.convert(str(target), start=0, end=None)
    finally:
        converter.close()

    if not target.exists() or target.stat().st_size == 0:
        print("La conversion no genero un DOCX valido.", file=stderr)
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
