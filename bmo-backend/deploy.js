const { execSync } = require('child_process');

try {
  console.log('🔨 Buildando...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📦 Adicionando dist...');
  execSync('git add dist/', { stdio: 'inherit' });

  // Verifica se tem algo para commitar
  try {
    execSync('git diff --cached --exit-code', { stdio: 'inherit' });
    console.log('✅ Dist não mudou, só fazendo push...');
  } catch {
    console.log('💾 Commitando dist atualizado...');
    execSync('git commit -m "build: atualizar dist"', { stdio: 'inherit' });
  }

  console.log('🚀 Enviando para o GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });

  console.log('✅ Deploy concluído!');
} catch (err) {
  console.error('❌ Erro:', err.message);
  process.exit(1);
}