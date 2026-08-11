"""Generate verse-by-verse audio timings for Free Use Bible API chapters.

The output is the ``AudioTimingRecord[]`` JSON that
``helloao import-audio-timings`` consumes (see
``packages/helloao-cli/actions.ts``), which lands the timings in the
``ChapterAudioTiming`` table and from there into
``/api/{translation}/{book}/{chapter}.{reader}.audioTimings.json``.
"""

__all__ = ["__version__"]

__version__ = "0.1.0"
