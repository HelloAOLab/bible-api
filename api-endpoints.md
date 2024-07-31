/api/available_translations.json
/api/{translationId}/books.json

# The list of available study notes
/api/available_studies.json

# Notes on the books.
# Should contain the intro summary for each book (if available)
/api/{studyId}/books.json

# Each book contains information about the author and intros, etc.
/api/{studyId}/{bookId}.json

# Each chapter contains verse-by-verse notes
/api/{studyId}/{bookId}/{chapter}.json

# The people that the study lists
/api/{studyId}/people.json

# The info for a person
/api/{studyId}/people/{personId}.json

# The list of articles that are available for a study
# These often cover various topics throughout the Bible
/api/{studyId}/articles.json

# The info for an article
/api/{studyId}/articles/{articleId}.json