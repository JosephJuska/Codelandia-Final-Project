const MarkdownIt = require('markdown-it');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const { window } = new JSDOM('');
const purify = DOMPurify(window);

const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    typographer: true,
    html: true,
});

const domPurifyConfig = {
    ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img',
        'figure', 'figcaption', 'dl', 'dt', 'dd', 'sup', 'sub'
    ],
    ALLOWED_STYLES: {
        '*': {
            'text-align': ['left', 'right', 'center', 'justify'],
            'color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/, /^hsl\(/, /^hsla\(/],
            'background-color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/, /^hsl\(/, /^hsla\(/],
            'font-size': [/^\d+(?:px|em|rem|%)$/],
            'font-weight': [/^\d{3,4}$/, /^bold$/],
            'text-decoration': ['none', 'underline', 'line-through', 'overline'],
            'width': [/^\d+(?:px|%)$/],
            'height': [/^\d+(?:px|%)$/]
        }
    },
    ALLOWED_SCHEMES: ['http', 'https', 'mailto', 'tel'],
    ALLOWED_SCHEMES_BY_TAG: {
        a: ['http', 'https', 'mailto', 'tel'],
        img: ['http', 'https', 'data']
    },
    FORBIDDEN_ATTRIBUTES: ['style', 'onmouseover', 'onfocus', 'onerror', 'onclick'],
    ALLOW_IFRAME_RELATIVE_URLS: false
};

const MDToHTML = (content) => {
    return purify.sanitize(md.render(content === null ? '' : content), domPurifyConfig);
};

module.exports = MDToHTML;