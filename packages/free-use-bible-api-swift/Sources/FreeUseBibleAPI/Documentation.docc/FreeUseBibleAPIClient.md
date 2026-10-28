# ``FreeUseBibleAPI/FreeUseBibleAPI``

## Topics

### Creating a Client

- ``init(endpoint:useCache:transport:)``
- ``defaultEndpoint``
- ``endpoint``
- ``useCache``

### Translations

- ``getAvailableTranslations(endpoint:)``
- ``getTranslationBooks(translation:endpoint:)``
- ``getTranslationBookChapter(translation:book:chapter:endpoint:)``
- ``getSimpleTranslationBookChapter(translation:book:chapter:endpoint:)``
- ``getCompleteTranslation(translation:endpoint:)``
- ``getSimpleCompleteTranslation(translation:endpoint:)``
- ``getTranslationBookChapterAudioTimings(translation:book:chapter:reader:endpoint:)``

### Word Annotations

- ``getTranslationBookChapterWords(translation:book:chapter:endpoint:)``
- ``getSimpleTranslationBookChapterWords(translation:book:chapter:endpoint:)``
- ``getChapterWords(_:endpoint:)-(ApiTranslationBookChapter,_)``
- ``getChapterWords(_:endpoint:)-(TranslationCompleteChapter,_)``
- ``getSimpleChapterWords(_:endpoint:)-(ApiSimpleTranslationBookChapter,_)``
- ``getSimpleChapterWords(_:endpoint:)-(SimpleTranslationCompleteChapter,_)``
- ``getVerseWords(_:_:)``
- ``getWordText(_:_:)``
- ``getSimpleVerseWords(_:_:)``
- ``getSimpleWordText(_:_:)``

### Commentaries

- ``getAvailableCommentaries(endpoint:)``
- ``getCommentaryBooks(commentary:endpoint:)``
- ``getCommentaryBookChapter(commentary:book:chapter:endpoint:)``
- ``getSimpleCommentaryBookChapter(commentary:book:chapter:endpoint:)``

### Datasets

- ``getAvailableDatasets(endpoint:)``
- ``getDatasetBooks(dataset:endpoint:)``
- ``getDatasetBookChapter(dataset:book:chapter:endpoint:)``
- ``getDatasetPeople(dataset:endpoint:)``
- ``getDatasetPerson(dataset:person:endpoint:)``
- ``getDatasetPlaces(dataset:endpoint:)``
- ``getDatasetPlace(dataset:place:endpoint:)``
- ``getDatasetEvents(dataset:endpoint:)``
- ``getDatasetEvent(dataset:event:endpoint:)``
- ``getDatasetPeopleGroups(dataset:endpoint:)``
- ``getDatasetPeopleGroup(dataset:group:endpoint:)``
- ``getDatasetLexicon(dataset:endpoint:)``
- ``getDatasetLexiconEntry(dataset:strongs:endpoint:)``

### Navigating Between Chapters

- ``getNextChapter(_:endpoint:)``
- ``getPreviousChapter(_:endpoint:)``
- ``getFirstChapter(_:endpoint:)-(ApiTranslationBook,_)``
- ``getFirstChapter(_:endpoint:)-(ApiCommentaryBook,_)``
- ``getFirstChapter(_:endpoint:)-(ApiDatasetBook,_)``
- ``getLastChapter(_:endpoint:)-(ApiTranslationBook,_)``
- ``getLastChapter(_:endpoint:)-(ApiCommentaryBook,_)``
- ``getLastChapter(_:endpoint:)-(ApiDatasetBook,_)``
- ``getSimpleChapter(_:endpoint:)-(ApiTranslationBookChapter,_)``
- ``getSimpleChapter(_:endpoint:)-(ApiCommentaryBookChapter,_)``

### Getting Text

- ``getVerseText(_:)``
- ``getChapterVerseText(_:options:)``
- ``getSimpleChapterVerseText(_:options:)``
- ``formatReference(_:_:)``
- ``formatReference(bookName:_:)``

### Following API Links

- ``getJSON(_:endpoint:useCache:)``
