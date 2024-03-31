---
sidebar_position: 1
---

# 创建一个页面

添加 **Markdown or React** 文件 to `src/pages` 用以创建一个 **单例页面**:

- `src/pages/index.js` → `localhost:3000/`
- `src/pages/foo.md` → `localhost:3000/foo`
- `src/pages/foo/bar.js` → `localhost:3000/foo/bar`

## 创建你的第一个 React 页面

创建一个文件位于 `src/pages/my-react-page.js`:

```jsx title="src/pages/my-react-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

现在可以查看页面通过访问url [http://localhost:3000/my-react-page](http://localhost:3000/my-react-page).

## 创建你的第一个 Markdown 页面

创建一个文件位于 `src/pages/my-markdown-page.md`:

```mdx title="src/pages/my-markdown-page.md"
# My Markdown page

This is a Markdown page
```

现在可以查看页面通过访问url [http://localhost:3000/my-markdown-page](http://localhost:3000/my-markdown-page).
