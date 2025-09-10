<script setup>
</script>

<template>
  <div class="splash-container">
    <div class="splash-content">
      <h1>Welcome to Turbo Broccoli</h1>
      <p class="tagline">Supercharge your web experience with speed and style.</p>
      <button class="cta">Get Started</button>
    </div>
  </div>
</template>

<style scoped>
.splash-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #fa8bff 100%);
}
.splash-content {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  padding: 3rem 4rem;
  text-align: center;
  max-width: 400px;
}
h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #222;
  letter-spacing: 1px;
}
.tagline {
  font-size: 1.2rem;
  color: #444;
  margin-bottom: 2rem;
}
.cta {
  background: linear-gradient(90deg, #ff8a00 0%, #e52e71 100%);
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.9rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px 0 rgba(229, 46, 113, 0.15);
  transition: background 0.3s, transform 0.2s;
}
.cta:hover {
  background: linear-gradient(90deg, #e52e71 0%, #ff8a00 100%);
  transform: translateY(-2px) scale(1.04);
}
</style>
