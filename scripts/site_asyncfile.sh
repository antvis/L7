echo `pwd`
rsync -av   --exclude .dumi/tmp-production --exclude .dumi/tmp  --exclude node_modules --exclude public  --exclude dist ./packages/site/ ./site_temp/l7-site/
cd ./site_temp/l7-site
git add .
git commit -m 'docs: 更新网站'
git push


echo '代码已提交'
