const fs = require('fs');
let content = fs.readFileSync('src/components/CodingAI.jsx', 'utf8');

const replacement = `    const interceptorScript = \`
        <script>
            window.onload = function() {
                document.addEventListener('click', function(e) {
                    const link = e.target.closest('a');
                    const button = e.target.closest('button');
                    if (link || button) {
                        e.preventDefault();
                    }
                });
                document.addEventListener('submit', function(e) {
                    e.preventDefault();
                });
            };
        </script>
    \`;

    const combinedCode = generatedCode ? (
        generatedCode.html.includes('</body>') 
            ? generatedCode.html.replace('</body>', interceptorScript + '\\n</body>')
            : generatedCode.html + '\\n' + interceptorScript
    ) : '';`;

content = content.replace(/const combinedCode = generatedCode \? `[\s\S]*?` : '';/, replacement);

fs.writeFileSync('src/components/CodingAI.jsx', content);
