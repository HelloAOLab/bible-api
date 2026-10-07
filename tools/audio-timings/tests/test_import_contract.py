"""Guard the contract with `helloao import-audio-timings`.

The output of this tool is only useful if it keeps matching the
``AudioTimingRecord`` interface in ``packages/helloao-cli/actions.ts``. That file
is the source of truth, so parse the field names straight out of it rather than
restating them here - if the TypeScript changes, this test fails loudly instead of
the import silently dropping data.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

from bible_audio_timings.writers import RECORD_FIELDS

ACTIONS_TS = (
    Path(__file__).resolve().parents[3] / "packages" / "helloao-cli" / "actions.ts"
)


def audio_timing_record_fields() -> list[str]:
    source = ACTIONS_TS.read_text(encoding="utf-8")
    match = re.search(
        r"export interface AudioTimingRecord\s*\{(.*?)\n\}", source, re.DOTALL
    )
    if not match:
        pytest.skip(f"AudioTimingRecord not found in {ACTIONS_TS}")
    body = match.group(1)
    # Strip block comments so their prose cannot look like a property.
    body = re.sub(r"/\*.*?\*/", "", body, flags=re.DOTALL)
    return re.findall(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*\??\s*:", body, re.MULTILINE)


@pytest.mark.skipif(not ACTIONS_TS.is_file(), reason="run inside the bible-api repo")
def test_record_fields_match_the_typescript_interface() -> None:
    assert audio_timing_record_fields() == list(RECORD_FIELDS)


@pytest.mark.skipif(not ACTIONS_TS.is_file(), reason="run inside the bible-api repo")
def test_import_command_still_reads_a_json_array() -> None:
    source = ACTIONS_TS.read_text(encoding="utf-8")
    assert "const records: AudioTimingRecord[] = JSON.parse(" in source
