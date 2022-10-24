--- AWS --- 

Aws Kısmında öncelikle DynamoDb'den bir table oluşturuldu, bu table'ın adı "coins" ve partition key olarak "coinsId" seçildi. Bu table'ın içine 3 adet item eklendi. Bu item'lar "coinsId" olarak "BTC", "ETH" ve "XRP" seçildi. Bu item'ların içine "name" ve "price" alanları eklendi. Bu alanların içine "Bitcoin", "Ethereum" ve "Ripple" yazıldı. "price" alanlarına ise "0" yazıldı.

Sonrasında Lambda Fonksiyonunu yazdım, burada bazı pathlerimiz var. Health Pathi, coin ve coins pathi var. Burada aslında kodsal bir hata olabilir ama mantıksal olarak çözüme ulaşmaya çalıştım. Eğer dynamodb'nin içi boş dönüyorsa httprequest ile path'e istek atılıp oradan datalar dönüyor, bunu coingecko'dan aldım. Eğer dynamodb'nin içi doluysa yani table'a data eklendiyse o return ediliyor. dynamorecordslarını scan etmek için bir fonksiyon yazıldı, ve sonrasında da buildresponse adlı bir fonksiyon yazıldı. Bu fonksiyon içinde de response'ın body'si oluşturuldu. Bu body'yi oluşturmak için bir döngü yazıldı. Bu döngü içinde dynamorecords'lar dönüldü ve response'ın body'sine eklendi. Sonrasında da response döndürüldü.

Lambda fonksiyonun çalıştığı senaryoda bu sefer api gateway'den api oluşturuldu ve resourchler ve onlara bağlı stageler oluşturdum. Buradan coin ve coins adlı iki resource ve bunlara bağlı bir stage oluşturdum. lambda-api adlı bir api yazdım ve kodu da deploy ettikten sonra burada işlemleri gerçekleştirebildim. 

Bazı kontrollere izin vermem gerekti, örneğin cloudwatchlogs ve dynamodb'a erişim izni verdim. Bu izinleri vermeden önce bu servislerin içindeki logları ve dynamodb'nin içindeki tabloları göremiyordum. Bu izinleri verdiğimde bu servislerin içindeki logları ve dynamodb'nin içindeki tabloları görebildim. 

Deployment sonrası da AWS bana bir domain ve oluşturduğum resource ve stage'lerin url'lerini verdi. Bu url'leri kullanarak da istek atabildim.

