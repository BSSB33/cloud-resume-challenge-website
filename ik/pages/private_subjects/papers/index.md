---
papers: !file papers.json
---

# Paper like Documents and Assignment Documentations by Me

<section class="two columns">
{{#papers}}
<a data-each="papers" target="_blank" href="{{url}}" class="{{color}} card">
    <strong>{{name}}</strong>
    <p>{{details}}</p>
</a>
{{/papers}}
</section>