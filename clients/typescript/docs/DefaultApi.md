# DefaultApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getAvailableCommentaries**](DefaultApi.md#getavailablecommentaries) | **GET** /api/available_commentaries.json |  |
| [**getAvailableDatasets**](DefaultApi.md#getavailabledatasets) | **GET** /api/available_datasets.json |  |
| [**getAvailableTranslations**](DefaultApi.md#getavailabletranslations) | **GET** /api/available_translations.json |  |
| [**getCommentaryBookChapter**](DefaultApi.md#getcommentarybookchapter) | **GET** /api/c/{commentary}/{book}/{chapter}.json |  |
| [**getCommentaryBooks**](DefaultApi.md#getcommentarybooks) | **GET** /api/c/{commentary}/books.json |  |
| [**getDatasetBookChapter**](DefaultApi.md#getdatasetbookchapter) | **GET** /api/d/{dataset}/{book}/{chapter}.json |  |
| [**getDatasetBooks**](DefaultApi.md#getdatasetbooks) | **GET** /api/d/{dataset}/books.json |  |
| [**getTranslationBookChapter**](DefaultApi.md#gettranslationbookchapter) | **GET** /api/{translation}/{book}/{chapter}.json |  |
| [**getTranslationBooks**](DefaultApi.md#gettranslationbooks) | **GET** /api/{translation}/books.json |  |
| [**getTranslationComplete**](DefaultApi.md#gettranslationcomplete) | **GET** /api/{translation}/complete.json |  |



## getAvailableCommentaries

> ApiAvailableCommentaries getAvailableCommentaries()



Get the list of available commentaries.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetAvailableCommentariesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.getAvailableCommentaries();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiAvailableCommentaries**](ApiAvailableCommentaries.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getAvailableDatasets

> ApiAvailableDatasets getAvailableDatasets()



Get the list of available datasets.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetAvailableDatasetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.getAvailableDatasets();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiAvailableDatasets**](ApiAvailableDatasets.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getAvailableTranslations

> ApiAvailableTranslations getAvailableTranslations()



Get the list of available Bible translations.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetAvailableTranslationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  try {
    const data = await api.getAvailableTranslations();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**ApiAvailableTranslations**](ApiAvailableTranslations.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getCommentaryBookChapter

> ApiCommentaryBookChapter getCommentaryBookChapter(commentary, book, chapter)



Get the content of a specific chapter of a specific book for a specific commentary.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetCommentaryBookChapterRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The commentary ID of the commentary to get the books or chapter content for.
    commentary: commentary_example,
    // BookId | IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    book: ...,
    // number | The chapter number to get the content for. This should be a positive integer.
    chapter: 8.14,
  } satisfies GetCommentaryBookChapterRequest;

  try {
    const data = await api.getCommentaryBookChapter(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **commentary** | `string` | The commentary ID of the commentary to get the books or chapter content for. | [Defaults to `undefined`] |
| **book** | `BookId` | IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html) | [Defaults to `undefined`] [Enum: GEN, EXO, LEV, NUM, DEU, JOS, JDG, RUT, 1SA, 2SA, 1KI, 2KI, 1CH, 2CH, EZR, NEH, EST, JOB, PSA, PRO, ECC, SNG, ISA, JER, LAM, EZK, DAN, HOS, JOL, AMO, OBA, JON, MIC, NAM, HAB, ZEP, HAG, ZEC, MAL, MAT, MRK, LUK, JHN, ACT, ROM, 1CO, 2CO, GAL, EPH, PHP, COL, 1TH, 2TH, 1TI, 2TI, TIT, PHM, HEB, JAS, 1PE, 2PE, 1JN, 2JN, 3JN, JUD, REV, TOB, JDT, ESG, WIS, SIR, BAR, LJE, S3Y, SUS, BEL, 1MA, 2MA, 3MA, 4MA, 1ES, 2ES, MAN, PS2, ODA, PSS, EZA, 5EZ, 6EZ, DAG, PS3, 2BA, LBA, JUB, ENO, 1MQ, 2MQ, 3MQ, REP, 4BA, LAO] |
| **chapter** | `number` | The chapter number to get the content for. This should be a positive integer. | [Defaults to `undefined`] |

### Return type

[**ApiCommentaryBookChapter**](ApiCommentaryBookChapter.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |
| **404** | 404 Not Found - The specified commentary, book, or chapter was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getCommentaryBooks

> ApiCommentaryBooks getCommentaryBooks(commentary)



Get the list of books available for a specific commentary.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetCommentaryBooksRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The commentary ID of the commentary to get the books or chapter content for.
    commentary: commentary_example,
  } satisfies GetCommentaryBooksRequest;

  try {
    const data = await api.getCommentaryBooks(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **commentary** | `string` | The commentary ID of the commentary to get the books or chapter content for. | [Defaults to `undefined`] |

### Return type

[**ApiCommentaryBooks**](ApiCommentaryBooks.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |
| **404** | 404 Not Found - The specified commentary was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getDatasetBookChapter

> ApiDatasetBookChapter getDatasetBookChapter(dataset, book, chapter)



Get the content of a specific chapter of a specific book for a specific dataset.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetDatasetBookChapterRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The dataset ID of the dataset to get the books or chapter content for.
    dataset: dataset_example,
    // BookId | IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    book: ...,
    // number | The chapter number to get the content for. This should be a positive integer.
    chapter: 8.14,
  } satisfies GetDatasetBookChapterRequest;

  try {
    const data = await api.getDatasetBookChapter(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **dataset** | `string` | The dataset ID of the dataset to get the books or chapter content for. | [Defaults to `undefined`] |
| **book** | `BookId` | IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html) | [Defaults to `undefined`] [Enum: GEN, EXO, LEV, NUM, DEU, JOS, JDG, RUT, 1SA, 2SA, 1KI, 2KI, 1CH, 2CH, EZR, NEH, EST, JOB, PSA, PRO, ECC, SNG, ISA, JER, LAM, EZK, DAN, HOS, JOL, AMO, OBA, JON, MIC, NAM, HAB, ZEP, HAG, ZEC, MAL, MAT, MRK, LUK, JHN, ACT, ROM, 1CO, 2CO, GAL, EPH, PHP, COL, 1TH, 2TH, 1TI, 2TI, TIT, PHM, HEB, JAS, 1PE, 2PE, 1JN, 2JN, 3JN, JUD, REV, TOB, JDT, ESG, WIS, SIR, BAR, LJE, S3Y, SUS, BEL, 1MA, 2MA, 3MA, 4MA, 1ES, 2ES, MAN, PS2, ODA, PSS, EZA, 5EZ, 6EZ, DAG, PS3, 2BA, LBA, JUB, ENO, 1MQ, 2MQ, 3MQ, REP, 4BA, LAO] |
| **chapter** | `number` | The chapter number to get the content for. This should be a positive integer. | [Defaults to `undefined`] |

### Return type

[**ApiDatasetBookChapter**](ApiDatasetBookChapter.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |
| **404** | 404 Not Found - The specified dataset, book, or chapter was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getDatasetBooks

> ApiDatasetBooks getDatasetBooks(dataset)



Get the list of books available for a specific dataset.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetDatasetBooksRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The dataset ID of the dataset to get the books or chapter content for.
    dataset: dataset_example,
  } satisfies GetDatasetBooksRequest;

  try {
    const data = await api.getDatasetBooks(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **dataset** | `string` | The dataset ID of the dataset to get the books or chapter content for. | [Defaults to `undefined`] |

### Return type

[**ApiDatasetBooks**](ApiDatasetBooks.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |
| **404** | 404 Not Found - The specified dataset was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getTranslationBookChapter

> ApiTranslationBookChapter getTranslationBookChapter(translation, book, chapter)



Get the content of a specific chapter of a specific book for a specific translation.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetTranslationBookChapterRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The translation ID of the Bible translation to get the books for. For example, \"eng_kjv\" for the King James Version.
    translation: translation_example,
    // BookId | IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html)
    book: ...,
    // number | The chapter number to get the content for. This should be a positive integer.
    chapter: 8.14,
  } satisfies GetTranslationBookChapterRequest;

  try {
    const data = await api.getTranslationBookChapter(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **translation** | `string` | The translation ID of the Bible translation to get the books for. For example, \&quot;eng_kjv\&quot; for the King James Version. | [Defaults to `undefined`] |
| **book** | `BookId` | IDs for books. Follows the USFM standard (https://ubsicap.github.io/usfm/identification/books.html) | [Defaults to `undefined`] [Enum: GEN, EXO, LEV, NUM, DEU, JOS, JDG, RUT, 1SA, 2SA, 1KI, 2KI, 1CH, 2CH, EZR, NEH, EST, JOB, PSA, PRO, ECC, SNG, ISA, JER, LAM, EZK, DAN, HOS, JOL, AMO, OBA, JON, MIC, NAM, HAB, ZEP, HAG, ZEC, MAL, MAT, MRK, LUK, JHN, ACT, ROM, 1CO, 2CO, GAL, EPH, PHP, COL, 1TH, 2TH, 1TI, 2TI, TIT, PHM, HEB, JAS, 1PE, 2PE, 1JN, 2JN, 3JN, JUD, REV, TOB, JDT, ESG, WIS, SIR, BAR, LJE, S3Y, SUS, BEL, 1MA, 2MA, 3MA, 4MA, 1ES, 2ES, MAN, PS2, ODA, PSS, EZA, 5EZ, 6EZ, DAG, PS3, 2BA, LBA, JUB, ENO, 1MQ, 2MQ, 3MQ, REP, 4BA, LAO] |
| **chapter** | `number` | The chapter number to get the content for. This should be a positive integer. | [Defaults to `undefined`] |

### Return type

[**ApiTranslationBookChapter**](ApiTranslationBookChapter.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |
| **404** | 404 Not Found - The specified translation, book, or chapter was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getTranslationBooks

> ApiTranslationBooks getTranslationBooks(translation)



Get the list of books available for a specific translation.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetTranslationBooksRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The translation ID of the Bible translation to get the books for. For example, \"eng_kjv\" for the King James Version.
    translation: translation_example,
  } satisfies GetTranslationBooksRequest;

  try {
    const data = await api.getTranslationBooks(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **translation** | `string` | The translation ID of the Bible translation to get the books for. For example, \&quot;eng_kjv\&quot; for the King James Version. | [Defaults to `undefined`] |

### Return type

[**ApiTranslationBooks**](ApiTranslationBooks.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |
| **404** | 404 Not Found - The specified translation was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getTranslationComplete

> ApiTranslationComplete getTranslationComplete(translation)



Get the complete content of a specific translation.

### Example

```ts
import {
  Configuration,
  DefaultApi,
} from '';
import type { GetTranslationCompleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DefaultApi();

  const body = {
    // string | The translation ID of the Bible translation to get the books for. For example, \"eng_kjv\" for the King James Version.
    translation: translation_example,
  } satisfies GetTranslationCompleteRequest;

  try {
    const data = await api.getTranslationComplete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **translation** | `string` | The translation ID of the Bible translation to get the books for. For example, \&quot;eng_kjv\&quot; for the King James Version. | [Defaults to `undefined`] |

### Return type

[**ApiTranslationComplete**](ApiTranslationComplete.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | 200 OK |  -  |
| **404** | 404 Not Found - The specified translation was not found, or complete translations are not available. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

