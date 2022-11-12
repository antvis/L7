
if [ -d "./site_temp" ]; then
  rm -rf ./site_temp
fi

mkdir ./site_temp
cd ./site_temp

git clone  https://code.alipay.com/datavis/l7-site.git --depth=1

cd l7-site

git checkout -b feat_update_site



rsync -av  --exclude .dumi/tmp  --exclude node_modules --exclude public  --exclude dist packages/site/* ./site_temp/l7-site

git add .

git commit -m 'docs: 更新网站'

git push --set-upstream origin feat_update_site

echo '代码已提交'