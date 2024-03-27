import cheerio from 'cheerio';
import type { IApi } from 'dumi';
import fs from 'fs';
import path from 'path';
import readMarkdown from 'read-markdown';

export default (api: IApi) => {
  api.describe({
    key: 'docsMeta',
    config: {
      schema(joi) {
        return joi.string();
      },
    },
    // enableBy: api.EnableBy.config
  });

  api.modifyExportHTMLFiles(async (files: Array<{ path: string; content: string }>) => {
    const newFiles = await Promise.all(
      files.map(async (file) => {
        const pathItems = file.path.split('/');
        const prefix = pathItems[0];
        let pathstr = file.path;
        // API/Tutorial
        if ((prefix === 'en' || prefix === 'zh') && pathItems[1] !== 'examples') {
          pathstr =
            '../../docs/' + file.path.substring(3).replace(/\/index\.html/, `.${prefix}.md`);
        }

        if (pathItems[0] === 'api' || pathItems[0] === 'tutorial') {
          pathstr = '../../docs/' + file.path.replace(/\/index.html/, '.zh.md');
        }

        if (pathItems[0] === 'common') {
          pathstr = '../../docs/' + file.path.replace(/\/index.html/, '.md');
        }

        // Examples
        if ((prefix === 'en' || prefix === 'zh') && pathItems[1] === 'examples') {
          pathstr = '../../' + pathItems.slice(1).join('/').replace(/html/, `${prefix}.md`);
        }
        if (pathItems[0] === 'examples') {
          pathstr = '../../' + pathItems.join('/').replace(/\.html/, '.zh.md');
        }

        // custom

        if (pathItems[0] === 'custom') {
          pathstr = '../../' + file.path.replace(/\/index.html/, '.md');
        }

        //   const md = `./docs/${pathstr}`;
        const md = path.resolve(__dirname, pathstr);

        const keywords: string[] = [];

        // 提取demo 关键字
        if (pathItems[0] === 'examples' || pathItems[1] === 'examples') {
          const metaPath = md.split('/').slice(0, -1).join('/') + '/demo/meta.json';
          if (fs.existsSync(metaPath)) {
            const metas = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

            keywords.push(
              ...metas.demos.map((demo: any) => {
                return demo.title.zh ? demo.title.zh : demo.title;
              }),
            );
          }
        }

        if (fs.existsSync(md)) {
          const str = await readMarkdown(md);
          const mdData = str[md].data || {};
          const { title, description } = mdData;
          const $ = cheerio.load(file.content);

          if (description) {
            $('head').append(`<meta name="description" content="${description}" />`);
            $('head').append(`<meta property="og:description" content="${description}"`);
            // }
          }
          if (mdData.keywords) {
            keywords.push(...mdData.keywords);
          }

          if (keywords.length > 0) {
            $('head').append(`<meta name="keywords" content="${keywords.join(',')}" />`);
          }
          if (title) {
            const main = $('title').text();
            const newTitle = `${title} |  ${main}`;
            $('head').append(`<meta property="og:title" content="${newTitle}" />`);
            $('title').text(newTitle);
          }

          file.content = $.html();
        } else {
          console.log('no file', md, file.path);
        }

        return file;
      }),
    );
    return newFiles;
  });
};
