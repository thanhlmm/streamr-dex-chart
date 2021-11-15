import { useEffect, useMemo, useRef, useState } from "react";
import { Subscription } from "streamr-client";
import client from "../lib/streamr";
import Chart from "react-apexcharts";
import _ from "lodash";
import { init, getInstanceByDom } from "echarts";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";

const option = {
  title: {
    text: "Top 10 DEX by volume",
  },
  tooltip: {
    trigger: "axis",
  },
  // legend: {
  //   data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
  // },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "time",
    // boundaryGap: false,
    // data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Email",
      type: "line",
      // stack: "Total",
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "Union Ads",
      type: "line",
      // stack: "Total",
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: "Video Ads",
      type: "line",
      // stack: "Total",
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: "Direct",
      type: "line",
      // stack: "Total",
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: "Search Engine",
      type: "line",
      // stack: "Total",
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
};

const DexVolume = () => {
  const subRef = useRef<Subscription | null>(null);
  const chartRef = useRef(null);
  const [data, setData] = useState<any[]>([]);
  const [dexes, setDexes] = useState<any[]>([]);

  const subcribeData = async () => {
    const sub = await client.subscribe(
      {
        stream: import.meta.env.VITE_STREAMR_STREAMID as string,
      },
      (message, metadata) => {
        setData(message);
        // TODO: Append data
      }
    );

    subRef.current = sub;
  };

  useEffect(() => {
    subcribeData();

    return () => {
      if (subRef.current) {
        subRef.current.unsubscribe();
      }
    };
  }, []);

  const getLastData = async () => {
    client.resend(
      {
        stream: import.meta.env.VITE_STREAMR_STREAMID as string,
        resend: {
          last: 100,
        },
      },
      (message) => {
        // console.log(message);
        const dataParsed = JSON.parse(message.data.data);
        setData((data) => {
          return [...data, [new Date(dataParsed[0].lastUpdated), dataParsed]];
        });
      }
    );
  };

  useEffect(() => {
    getLastData();
  }, []);

  const categories = useMemo(() => {
    return _.uniq(
      data.reduce((prev, [_, dataPoint]) => {
        return [...prev, ...dataPoint.map((dexData: any) => dexData.slug)];
      }, [])
    ).slice(1, 10);
  }, [data]);

  const seriesData = useMemo(() => {
    return categories.map((slug) => {
      return {
        name: slug,
        type: "line",
        data: data.map(([date, dataRow]) => {
          const dexData = dataRow.find((dex: any) => dex.slug === slug);
          return [new Date(date).getTime(), dexData?.totalVol24h || 0];
        }),
      };
    });
  }, [data]);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current);
    }
    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, []);

  useEffect(() => {
    // Update chart
    if (chartRef.current) {
      const chart = getInstanceByDom(chartRef.current);
      const chartOption = {
        ...option,
        series: seriesData,
      };
      if (chart) {
        chart.setOption(chartOption);
      }
    }
  }, [seriesData]);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
};

export default DexVolume;
