<template>
  <div class="avatar-circle-sm">
    <span class="initials" id="initials" name="initials">{{this.initials}}</span>
  </div>
</template>
<script>
export default {
  props: ['initials']
}
</script>
<style scoped lang="scss">
@mixin avatar($size) {
  width: $size;
  height: $size;
  background-color: white;
  text-align: center;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;

  .initials {
    position: relative;
    top: $size * 0.25;
    font-size: $size * 0.5;
    line-height: $size * 0.5;
    color: #2c47a1;
    font-family: "Courier New", monospace;
    font-weight: bold;
    text-transform: uppercase;
  }
}

.avatar-circle-sm {
  @include avatar(30px);
}

</style>
