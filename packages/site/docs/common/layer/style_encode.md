#### 样式数据映射
默认样式配置为常量值，某些配置也支持数据映射，映射定义同 color、size参数一致。

- field: 映射字段
- value： 映射区间或者自定义回调函数

如：

```ts
layer.style({
    opacity:{
        field:'name'
        value:[0.1,0.5,1],

    }
})
```


D-AE,2023-08-03 17:45:13:851,,,2,,,166135,1000,102023,H5behavior,2,,,,,,,,,,,,,,1792x1120,,,,Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/115.0.0.0 Safari/537.36,,,,,,,code=5^msg=mearth-pre.alipay.com^sampleRate=1^bm_sid=S09001663891^yuyan_id=180020010000012660^env=PRE^title=^fullURL=https%3A%2F%2Fmearth-pre.alipay.com%2Fmap%2Fproduct%2Fremote-sensing-market%3FtenantId%3De7769abb^monitor_ver=sdk%3A1.1.0^dom_cnt=25^delay=13^scroll_top=0^content_height=421^s_c=true^network=4g$$D-AE,2023-08-03 17:45:14:353,,,2,,,166135,1000,102023,H5behavior,2,,,,,,,,,,,,,,1792x1120,,,,Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/115.0.0.0 Safari/537.36,,,,,,,code=16^msg=mearth-app(180020010001254664)^d1=mearth-pre.alipay.com^m1=172^m2=69.80000001192093^m3=98.79999995231628^m4=3.400000035762787^c1=%7B%0A%20%20%22umi.453ef0b1.js%22%3A%20828772%2C%0A%20%20%22umi.06e905e1.css%22%3A%2010678%0A%7D^sampleRate=1^bm_sid=S09001663891^yuyan_id=180020010000012660^env=PRE^title=MEarth^fullURL=https%3A%2F%2Fmearth-pre.alipay.com%2Fmap%2Fproduct%2Fremote-sensing-market%3FtenantId%3De7769abb^monitor_ver=sdk%3A1.1.0^dom_cnt=98^delay=512^scroll_top=0^content_height=421^s_c=true^network=4g$$D-AE,2023-08-03 17:45:14:354,,,2,,,166135,1000,102023,H5behavior,2,,,,,,,,,,,,,,1792x1120,,,,Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/115.0.0.0 Safari/537.36,,,,,,,code=27^msg=https%3A%2F%2Fmearth-pre.alipay.com%2Fmap^d1=mearth-app(180020010001254664)^m1=729.7000000476837^m2=659.9000000357628^sampleRate=1^bm_sid=S09001663891^yuyan_id=180020010000012660^env=PRE^title=MEarth^fullURL=https%3A%2F%2Fmearth-pre.alipay.com%2Fmap%2Fproduct%2Fremote-sensing-market%3FtenantId%3De7769abb^monitor_ver=sdk%3A1.1.0^dom_cnt=98^delay=516^scroll_top=0^content_height=421^s_c=true^network=4g