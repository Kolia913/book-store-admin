<template>
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 122.88 98.15"
    style="enable-background: new 0 0 122.88 98.15"
    xml:space="preserve"
    :fill="color ? color : '#A1A1AA'"
  >
    <g>
      <path
        class="st0"
        d="M6.02,0h33.66L50.8,12.3h66.46c3.1,0,5.63,2.55,5.63,5.63V92.5c0,3.1-2.53,5.64-5.63,5.64l-110.59,0 C3.56,98.15,0,95.6,0,92.5V6.02C0,2.72,2.72,0,6.02,0L6.02,0z M111.83,27.42c0-2.98-2.46-5.42-5.43-5.42H17.46 c-2.96,0-6.41,2.44-6.41,5.42v53.8c0,3,3.45,5.43,6.41,5.43h88.95c2.97,0,5.43-2.44,5.43-5.43V27.42L111.83,27.42z"
      />
    </g>
  </svg>
</template>
<script>
export default {
  name: 'DirectIcon',
  props: ['color'],
};
</script>
<style lang="scss" scoped>
.line {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 32px;
}
.st0 {
  fill-rule: evenodd;
  clip-rule: evenodd;
}
</style>
