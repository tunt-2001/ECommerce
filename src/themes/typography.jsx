const Typography = (fontFamily, borderRadius) => ({
    fontFamily,
    h6: { fontWeight: 500, color: 'inherit', fontSize: '0.75rem' },
    h5: { fontSize: '0.875rem', color: 'inherit', fontWeight: 500 },
    h4: { fontSize: '1rem', color: 'inherit', fontWeight: 600 },
    h3: { fontSize: '1.25rem', color: 'inherit', fontWeight: 600 },
    h2: { fontSize: '1.5rem', color: 'inherit', fontWeight: 700 },
    h1: { fontSize: '2.125rem', color: 'inherit', fontWeight: 700 },
    subtitle1: { fontSize: '0.875rem', fontWeight: 500, color: 'inherit' },
    subtitle2: { fontSize: '0.75rem', fontWeight: 400, color: 'inherit' },
    caption: { fontSize: '0.75rem', color: 'inherit', fontWeight: 400 },
    body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.334em' },
    body2: { letterSpacing: '0em', fontWeight: 400, lineHeight: '1.5em', color: 'inherit' },
    button: { textTransform: 'capitalize' },
    customInput: {
        marginTop: 1,
        marginBottom: 1,
        '& > label': { top: 23, left: 0, color: 'inherit', '&[data-shrink="false"]': { top: 5 } },
        '& > div > input': { padding: '30.5px 14px 11.5px !important' },
        '& legend': { display: 'none' },
        '& fieldset': { top: 0 }
    },
    mainContent: {
        backgroundColor: 'inherit',
        width: '100%',
        minHeight: 'calc(100vh - 88px)',
        flexGrow: 1,
        padding: '20px',
        marginTop: '88px',
        marginRight: '20px',
        borderRadius: `${borderRadius}px`
    },
});

export default Typography;