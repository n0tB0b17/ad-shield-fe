import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Or choose another theme
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const CodeSnippet = ({ language = 'text', code }) => {
    if (!code) {
        return null;
    }

    return (
        <Paper variant="outlined" sx={{ mt: 1, mb: 1, backgroundColor: '#2d2d2d' /* Match theme bg */ }}>
            <Box sx={{ maxHeight: '300px', overflow: 'auto', fontSize: '0.8rem' }}>
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    showLineNumbers={false} // Optional: show line numbers
                    wrapLines={true}
                    customStyle={{ margin: 0, padding: '10px', borderRadius: '4px' }} // Override default styles if needed
                >
                    {String(code)}
                </SyntaxHighlighter>
            </Box>
        </Paper>
    );
};

export default CodeSnippet;