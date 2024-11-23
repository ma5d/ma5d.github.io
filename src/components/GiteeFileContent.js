import React, { useEffect, useState } from 'react';
import CodeBlock from '@theme/CodeBlock';

const GiteeFileContent = ({ owner, repo, filePath, branch = 'main', startLine, endLine}) => {
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const url = `https://gitee.com/api/v5/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
        const response = await fetch(url);
        const data = await response.json();

        const binaryString = atob(data.content);
        const binaryArray = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        const decodedContent = new TextDecoder('utf-8').decode(binaryArray);

        const contentLines = decodedContent.split('\n');
        const start = startLine ? Math.max(startLine - 1, 0) : 0;
        const end = endLine ? endLine : contentLines.length;
        const selectedLines = contentLines.slice(start, end).join('\n');

        setFileContent(selectedLines);

      } catch (error) {
        console.error('Error fetching file content:', error);
      }
    };

    fetchFileContent();
  }, [owner, repo, filePath, branch, startLine, endLine]);

  return (
    <CodeBlock language="java">
      {fileContent}
    </CodeBlock>
  );
};

export default GiteeFileContent;
