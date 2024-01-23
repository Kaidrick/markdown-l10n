export default () => [
    { regex: /^(#{1}\s)(.*)$/, label: 'H1', hint: 'Header One' },
    { regex: /^(#{2}\s)(.*)$/, label: 'H2', hint: 'Header Two' },
    { regex: /^(#{3}\s)(.*)$/, label: 'H3', hint: 'Header Three' },
    { regex: /^(#{4}\s)(.*)$/, label: 'H4', hint: 'Header Four' },
    { regex: /^(#{5}\s)(.*)$/, label: 'H5', hint: 'Header Five' },
    { regex: /^(#{6}\s)(.*)$/, label: 'H6', hint: 'Header Six' },
    { regex: /(\*|\_)+(.+)(\*|\_)+/, label: 'B/I', hint: 'Bold or Italics' },
    { regex: /\[([\w\s\d]+)](.+)/, label: 'LINK', hint: 'URI LINK' },
    { regex: /`+/, label: '</>', hint: 'Code' },
]
