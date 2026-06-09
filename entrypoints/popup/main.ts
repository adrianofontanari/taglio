import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="popup">
    <div class="logo">✂️</div>
    <strong>Taglio</strong>
    <p>Active on ChatGPT.<br>Detecting PII in real time.</p>
    <a href="https://github.com/adrianofontanari/taglio" target="_blank">GitHub</a>
  </div>
`;
