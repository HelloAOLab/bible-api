// CloudFront Function (cloudfront-js-2.0 runtime) for the viewer-request
// event of the behavior that serves the docs from S3.
//
// CloudFront's Default Root Object only applies to the root of the
// distribution, and the S3 REST origin has no notion of index documents, so
// a request for `/docs/` (or `/docs/guide/`, `/docs/es/`, ...) asks S3 for a
// key that does not exist. The custom error response then serves 404.html in
// its place. VuePress's client router still resolves the address to the real
// page, so the 404 page's build-time HTML does not match what the browser
// renders and hydration fails, and the page is sent with a 404 status.
//
// This maps every directory address under /docs to its index.html, and sends
// addresses with no trailing slash or extension (`/docs`, `/docs/guide`) to
// the directory address so relative links resolve the same way as the build.
//
// To deploy: create a CloudFront Function with this code, publish it, and
// associate it with the viewer-request event of the `/docs*` cache behavior.
// It leaves any other path alone, so it is also safe on the default behavior.

function handler(event) {
    var request = event.request;
    var uri = request.uri;

    if (uri !== '/docs' && uri.indexOf('/docs/') !== 0) {
        return request;
    }

    if (uri.charAt(uri.length - 1) === '/') {
        request.uri = uri + 'index.html';
        return request;
    }

    var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
    if (lastSegment.indexOf('.') === -1) {
        var query = queryString(request.querystring);
        return {
            statusCode: 301,
            statusDescription: 'Moved Permanently',
            headers: {
                location: { value: uri + '/' + (query ? '?' + query : '') },
            },
        };
    }

    return request;
}

function queryString(querystring) {
    var parts = [];
    for (var key in querystring) {
        var param = querystring[key];
        var values = param.multiValue
            ? param.multiValue.map(function (v) {
                  return v.value;
              })
            : [param.value];
        for (var i = 0; i < values.length; i++) {
            parts.push(values[i] === '' ? key : key + '=' + values[i]);
        }
    }
    return parts.join('&');
}
