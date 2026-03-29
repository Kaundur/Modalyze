import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';


export const CodeBlock = ({code}: {code: string}) => {
  return (
    <SyntaxHighlighter language={'tsx'} style={oneLight}>
      {code}
    </SyntaxHighlighter>
  );
};
