import { getImage } from '../../util/ajax';
export default function image(data, cfg) {
  const { extent } = cfg;

  const images = new Promise(resolve => {
    loadData(data, res => {
      resolve(res);
    });
  });
  const resultData = {
    images,
    _id: 1,
    dataArray: [{ coordinates: [[ extent[0], extent[1] ], [ extent[2], extent[3] ]] }]
  };
  return resultData;
}
function loadData(data, done) {
  const url = data;
  let image = [];
  if (typeof (url) === 'string') {
    getImage({ url }, (err, img) => {
      image = img;
      done(image);
    });
  } else {
    const imageCount = url.length;
    let imageindex = 0;
    url.forEach(item => {
      getImage({ url: item }, (err, img) => {
        imageindex++;
        image.push(img);
        if (imageindex === imageCount) {
          done(image);
        }

      });
    });

  }
  return image;
}
