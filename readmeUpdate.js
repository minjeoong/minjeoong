import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

// README.md 파일 읽기
const readmePath = "README.md";
let readmeContent = readFileSync(readmePath, "utf8");

// RSS 파서 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

// 최신 블로그 포스트 추가
(async () => {
  // RSS 피드 가져오기
  const feed = await parser.parseURL("https://orange-mj.tistory.com/rss");

  // 최신 3개의 글의 제목과 링크를 추가할 텍스트 생성
  let latestPosts = "### 🌱 Blog Posting\n\n";
  for (let i = 0; i < 3 && i < feed.items.length; i++) {
    const { title, link } = feed.items[i];
    latestPosts += `- [${title}](${link})\n`;
  }

  // 기존 README.md에 최신 블로그 포스트 추가
  const newReadmeContent = readmeContent.includes("### 🌱 Blog Posting")
    ? readmeContent.replace(
      /### 🌱 Blog Posting[\s\S]*?(?=\n\n## |\n$)/,
      latestPosts
    )
    : readmeContent + latestPosts;

  if (newReadmeContent !== readmeContent) {
    writeFileSync(readmePath, newReadmeContent, "utf8");
    console.log("README.md 업데이트 완료");
  } else {
    console.log("새로운 블로그 포스트가 없습니다. README.md 파일이 업데이트되지 않았습니다.");
  }
})();
