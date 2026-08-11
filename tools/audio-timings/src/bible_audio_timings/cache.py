"""On-disk cache for downloaded audio and a manifest of completed chapters.

The manifest is what makes a multi-hour whole-translation run resumable: each
chapter is recorded the moment it finishes, so ``--resume`` skips it next time.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

MANIFEST_NAME = "manifest.json"


@dataclass(frozen=True)
class ChapterKey:
    translation_id: str
    book_id: str
    chapter_number: int
    reader: str

    def as_string(self) -> str:
        return (
            f"{self.translation_id}/{self.book_id}/{self.chapter_number}:{self.reader}"
        )


class Cache:
    def __init__(self, root: Path) -> None:
        self.root = root
        self.audio_root = root / "audio"
        self.manifest_path = root / MANIFEST_NAME
        self._manifest: dict[str, dict] | None = None

    # -- audio ------------------------------------------------------------

    def audio_path(self, key: ChapterKey, *, suffix: str = ".mp3") -> Path:
        """Cache location for a chapter's audio.

        Mirrors the layout that ``helloao fetch-audio`` writes
        (``actions.ts:675``), so a directory produced by that command can be
        passed straight to ``--audio``.
        """
        return (
            self.audio_root
            / key.translation_id
            / key.book_id
            / f"{key.chapter_number}.{key.reader}{suffix}"
        )

    # -- manifest ---------------------------------------------------------

    @property
    def manifest(self) -> dict[str, dict]:
        if self._manifest is None:
            if self.manifest_path.is_file() and self.manifest_path.stat().st_size:
                try:
                    loaded = json.loads(self.manifest_path.read_text(encoding="utf-8"))
                except ValueError:
                    loaded = {}
                self._manifest = loaded if isinstance(loaded, dict) else {}
            else:
                self._manifest = {}
        return self._manifest

    def is_done(self, key: ChapterKey) -> bool:
        entry = self.manifest.get(key.as_string())
        return bool(entry and entry.get("ok"))

    def entry(self, key: ChapterKey) -> dict | None:
        return self.manifest.get(key.as_string())

    def record(self, key: ChapterKey, *, ok: bool, detail: dict | None = None) -> None:
        self.manifest[key.as_string()] = {"ok": ok, **(detail or {})}
        self._flush()

    def _flush(self) -> None:
        self.root.mkdir(parents=True, exist_ok=True)
        partial = self.manifest_path.with_suffix(".json.part")
        partial.write_text(
            json.dumps(self.manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8"
        )
        partial.replace(self.manifest_path)
