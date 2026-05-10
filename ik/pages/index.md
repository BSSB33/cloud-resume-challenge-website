---
subjects: !file subjects.json
---
# Rólam
<span>
Vitrai Gábor - ABIOWE<br>
<a rel="me" href="mailto:abiowe@inf.elte.hu">abiowe@inf.elte.hu</a>
<br><br>
Sziasztok, Vitrai Gábor vagyok, de sokan csak Zseton-ként ismerhettek. Az EIT Digital, Data Science szakos hallgatója vagyok az ELTE IK-n és az oldalon hasznos anyagokat találhattok, amiket főként BSc tanulmányaim során szereztem/készítettem.<br>
Az oldalon többek között megtalálhatóak tantervek, záróvizsga tételsorok, és tantárgyak gyakorlati anyagai is.
</span>

<!--## Kurzusaim
<section class="two columns">
{{#courses}}
<a href="{{url}}" class="{{color}} card">
    <strong>{{name}}</strong>
    <p>{{details}}</p>
</a>
{{/courses}}
</section>-->

## Tantárgyaim
<section class="two columns">
{{#subjects}}
<a data-each="subjects" href="{{url}}" class="{{color}} card">
    <strong>{{name}}</strong>
    <p>{{details}}</p>
</a>
{{/subjects}}
</section>