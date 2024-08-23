<template>
	<v-container
		fluid
		class="my-v-container"
	>
		<v-row class="d-flex bg-red w-100 h-100" no-gutters>
			<v-col
				cols="12"
				md="6"
				class="d-flex justify-center align-center"
			>
				<v-card class="bg-light h-100" rounded="0" width="100%">
					<v-img src="@/assets/bg/bg-03.png" cover class="h-100">
						<v-card-text class="text-g d-flex flex-column align-center justify-center fill-height">
							<h1 class="mb-5">
								玉食堂 JADE
							</h1>
							<p class="text-center">
								歡迎來到玉食堂炒飯炒麵餐廳！<br>
								在這片綠意盎然的森林裡<br>
								我們用心為您準備了各種餐點<br>
								品嚐到最地道、最家常、最懷念的佳餚<br>
								趕快手刀加入玉食堂森林會員！
							</p>
						</v-card-text>
					</v-img>
				</v-card>
			</v-col>

			<v-col
				cols="12"
				md="6"
				class="d-flex justify-center align-center"
			>
				<v-card
					class="bg-dark h-100 text-center d-flex flex-column align-center justify-center fill-height"
					rounded="0"
					width="100%"
				>
					<!-- <a class="bear-link">
						<v-img src="@/assets/logo/logo-web-icon-white.png"></v-img>
					</a> -->

					<v-row justify="center">
						<v-col cols="12">
							<v-sheet class="article" elevation="5">
								<div class="assets">
									<img cover class="forest" src="@/assets/bg/A_repeating_pattern_background_featuring_stag_horn.jpg" alt="forest" />
									<h3>玉食堂</h3>
									<v-btn class="top-btn">
										<router-link to="/menu" class="top-btn-none-text-decoration">MENU</router-link>
									</v-btn>
									<!-- <img src="https://assets.codepen.io/605876/osaka-tower.png" alt="restaurant" /> -->
								</div>

								<div class="blur">
									<div v-for="index in 12" :key="index" class="layer" :style="{ '--index': index }"></div>
								</div>
							</v-sheet>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

// 更新動畫效果，基於鼠標位置
// const UPDATE = ({ x, y }) => {
//   gsap.set(document.documentElement, {
//     '--x': gsap.utils.mapRange(0, window.innerWidth, -1, 1, x),
//     '--y': gsap.utils.mapRange(0, window.innerHeight, -1, 1, y),
//   })
// }

// // 更新動畫效果，基於設備方向
// const handleOrientation = ({ beta, gamma }) => {
//   const isLandscape = window.matchMedia('(orientation: landscape)').matches
//   gsap.set(document.documentElement, {
//     '--x': gsap.utils.clamp(-1, 1, isLandscape ? gsap.utils.mapRange(-45, 45, -1, 1, beta) : gsap.utils.mapRange(-45, 45, -1, 1, gamma)),
//     '--y': gsap.utils.clamp(-1, 1, isLandscape ? gsap.utils.mapRange(20, 70, 1, -1, Math.abs(gamma)) : gsap.utils.mapRange(20, 70, 1, -1, beta)),
//   })
// }

// // 在 Vue 組件加載時綁定事件
// onMounted(() => {
//   window.addEventListener('mousemove', UPDATE)
//   document.body.addEventListener('click', START, { once: true })

//   const START = () => {
//     if (DeviceOrientationEvent?.requestPermission) {
//       DeviceOrientationEvent.requestPermission().then(result => {
//         if (result === 'granted') {
//           window.addEventListener('deviceorientation', handleOrientation)
//         }
//       })
//     } else {
//       window.addEventListener('deviceorientation', handleOrientation)
//     }
//   }
// })
</script>

<style scoped lang="scss">

.my-v-container{
padding: 0;
margin: 0px;
}

.v-container{
	padding: 0;
}

.bg-dark{
background-color: #13311a;
}

.bg-light{
background-color: #dddcd8;
}

.bg-y{
background-color: #D78A24;
}

.text-g{
	color: #3C5D44;
}


	/* 一般設置 */
	// .bear-link {
	// color: #000;
	// position: relative;
	// z-index: 1000;
	// // left: 1rem;
	// // display: grid;
	// // place-items: center;
	// opacity: 0.9;
	// }

	.article {
	position: relative;
	height: 100%;
	width: 100%;
	top: 0%;
	// 設置元素的寬高比
	// 2 / 1.1： 表示寬度是高度的 2 倍，並且高度是寬度的 1.1 分之一
	aspect-ratio: 2 / 1.3;
	// max-height: calc(100svh - 2rem);
	overflow: hidden;
	border-radius: 1.2em;
	}

	// .forest {
	// position: absolute;
	// top: 0;
	// left: 50%;
	// transform: translate(-50%, 0);
	// width: 100%;
	// height: 100%;
	// // width: 660px;
	// object-fit: cover;
	// // object-position: center 43%;
	// // user-select: none;
	// // pointer-events: none;
	// }

	.assets h3 {
	position: absolute;
	left: 50%;
	top: 48%;
	z-index: 12;
	margin: 0;
	font-size: 4rem;
	transform: translate(-50%, 0);
	text-transform: uppercase;
	font-family: 'Bebas Neue', sans-serif;
	color: white;
	}

	.top-btn {
	position: absolute;
	left: 50%;
	top: 82%;
	transform: translate(-50%, 0);
	z-index: 12;
	color: #3C5D44;
	text-decoration: none;
	}

	.top-btn-none-text-decoration {
		color: #3C5D44;
		text-decoration: none;
	}

	.blur {
	position: absolute;
	inset: 0;
	}

	.blur .layer {
	position: absolute;
	inset: 0;
	background: hsla(100, 25%, 12%, 0.05);
	backdrop-filter: blur(calc(var(--index) * 4px));
	mask: radial-gradient(180% 120% at 45% 90%, #fff 15%, #0000 calc(15% + var(--index) * 3%));
	box-shadow: #13311a 0 0 0 5px;
	opacity: 0.2;
	}

</style>