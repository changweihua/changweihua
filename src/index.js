import fetch from "node-fetch";

// 天气代码映射到SVG图标
const weatherIconMap = {
  0: "天气-晴.svg", // Clear sky
  1: "天气-晴.svg", // Mainly clear
  2: "天气-多云.svg", // Partly cloudy
  3: "天气-阴天.svg", // Overcast
  45: "天气-雾.svg", // Fog
  48: "天气-霜.svg", // Depositing rime fog
  51: "天气-小雨.svg", // Light drizzle
  53: "天气-小雨.svg", // Moderate drizzle
  55: "天气-中雨.svg", // Dense drizzle
  56: "天气-雨加雪.svg", // Light freezing drizzle
  57: "天气-雨加雪.svg", // Dense freezing drizzle
  61: "天气-小雨.svg", // Slight rain
  63: "天气-中雨.svg", // Moderate rain
  65: "天气-大雨.svg", // Heavy rain
  66: "天气-雨加雪.svg", // Light freezing rain
  67: "天气-雨加雪.svg", // Heavy freezing rain
  71: "天气-小雪.svg", // Slight snow fall
  73: "天气-中雪.svg", // Moderate snow fall
  75: "天气-大雪.svg", // Heavy snow fall
  77: "天气-雪转晴.svg", // Snow grains
  80: "天气-小雨.svg", // Slight rain showers
  81: "天气-中雨.svg", // Moderate rain showers
  82: "天气-暴雨.svg", // Violent rain showers
  85: "天气-小雪.svg", // Slight snow showers
  86: "天气-大雪.svg", // Heavy snow showers
  95: "天气-雷雨.svg", // Thunderstorm
  96: "天气-雷雨.svg", // Thunderstorm with slight hail
  99: "天气-冰雹.svg", // Thunderstorm with heavy hail
};

// 获取天气描述
function getWeatherDescription(code) {
  const descriptions = {
    0: "晴天",
    1: "晴天",
    2: "多云",
    3: "阴天",
    45: "有雾",
    48: "霜冻",
    51: "小雨",
    53: "小雨",
    55: "小雨",
    56: "雨夹雪",
    57: "雨夹雪",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    66: "雨夹雪",
    67: "雨夹雪",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "雪",
    80: "小阵雨",
    81: "中阵雨",
    82: "强阵雨",
    85: "小雪",
    86: "大雪",
    95: "雷雨",
    96: "雷雨",
    99: "冰雹",
  };
  return descriptions[code] || "未知天气";
}

// 获取天气数据并生成SVG
async function generateWeatherSVG() {
  try {
    // TODO: 填写目标城市的经纬度
    const latitude = 31.574729 // 纬度
    const longitude = 120.301663 // 经度
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FShanghai&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("无法获取天气数据");
    }

    const data = await response.json();
    const dailyData = [];

    // 处理天气数据
    for (let i = 0; i < data.daily.time.length; i++) {
      const date = new Date(data.daily.time[i]);
      const weatherCode = data.daily.weathercode[i];
      const maxTemp = Math.round(data.daily.temperature_2m_max[i]);
      const minTemp = Math.round(data.daily.temperature_2m_min[i]);
      dailyData.push({
        date: date,
        maxTemp: maxTemp,
        minTemp: minTemp,
        weatherCode: weatherCode,
        description: getWeatherDescription(weatherCode),
      });
    }

    // 生成SVG
    const svgWidth = dailyData.length * 100;
    const svgHeight = 180;
    let fullSvgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${svgWidth}" height="${svgHeight}" fill="transparent"/>
    <text x="${
      svgWidth / 2
    }" y="20" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="white" stroke="black" stroke-width="0.5">无锡市七天天气预报</text>
`;

    // 并行加载所有图标
    const iconPromises = dailyData.map(async (day, i) => {
      const xPos = i * 100;
      const iconName = weatherIconMap[day.weatherCode] || "天气-多云.svg";
      const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      const weekday = weekdays[day.date.getDay()];
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();

      try {
        const response = await fetch(
          `http://localhost:3000/static/${iconName}`
        );
        const iconSvg = await response.text();
        const base64Icon = btoa(iconSvg);

        return `
    <g transform="translate(${xPos}, 30)">
      <rect width="100" height="160" fill="transparent"/>
      <text x="50" y="20" font-family="Arial" font-size="14" text-anchor="middle" fill="white" stroke="black" stroke-width="0.5">${weekday} ${month}/${date}</text>
      <image href="data:image/svg+xml;base64,${base64Icon}" x="25" y="30" width="50" height="50"/>
      <text x="50" y="100" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white" stroke="black" stroke-width="0.5">${day.maxTemp}°C / ${day.minTemp}°C</text>
      <text x="50" y="125" font-family="Arial" font-size="12" text-anchor="middle" fill="white" stroke="black" stroke-width="0.5">${day.description}</text>
    </g>`;
      } catch (error) {
        console.error(`Error loading icon ${iconName}:`, error);
        return `
    <g transform="translate(${xPos}, 30)">
      <rect width="100" height="160" fill="transparent"/>
      <text x="50" y="20" font-family="Arial" font-size="14" text-anchor="middle" fill="white" stroke="black" stroke-width="0.5">${weekday} ${month}/${date}</text>
      <text x="50" y="65" font-family="Arial" font-size="10" text-anchor="middle" fill="red" stroke="black" stroke-width="0.5">图标加载失败</text>
      <text x="50" y="100" font-family="Arial" font-size="14" font-weight="bold" text-anchor="middle" fill="white" stroke="black" stroke-width="0.5">${day.maxTemp}°C / ${day.minTemp}°C</text>
      <text x="50" y="125" font-family="Arial" font-size="12" text-anchor="middle" fill="white" stroke="black" stroke-width="0.5">${day.description}</text>
    </g>`;
      }
    });

    const iconResults = await Promise.all(iconPromises);
    fullSvgContent += iconResults.join("") + "\n</svg>";

    // 保存SVG文件
    const saveResponse = await fetch("http://localhost:3000/save-svg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ svg: fullSvgContent }),
    });

    const result = await saveResponse.json();
    if (!result.success) {
      throw new Error(result.error || "保存失败");
    }

    console.log("天气预报SVG已保存");
  } catch (error) {
    console.error("生成SVG失败:", error);
    throw error;
  }
}

function getCitylocation() {}

// 立即执行生成SVG
generateWeatherSVG().catch((error) => {
  console.error("执行失败:", error);
});
