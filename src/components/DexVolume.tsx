import { useEffect, useMemo, useRef, useState } from "react";
import { Subscription } from "streamr-client";
import client from "../lib/streamr";
import _ from "lodash";
import { init, getInstanceByDom, ECharts } from "echarts";

const option = {
  title: {
    text: "Top 10 DEX by volume",
  },
  legend: {
    type: "plain",
  },
  grid: {
    left: "3%",
    right: "3%",
    bottom: "3%",
    containLabel: true,
  },
  tooltip: {
    order: "valueDesc",
    trigger: "axis",
  },
  xAxis: {
    type: "time",
    splitLine: {
      show: false,
    },
  },
  // xAxis: {
  //   type: "category",
  //   nameLocation: "middle",
  // },
  yAxis: {
    type: "value",
    boundaryGap: [0, "100%"],
  },
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
        resend: {
          last: 200,
        },
      },
      (message, metadata) => {
        const dataParsed = JSON.parse(message.data.data);
        setData((data) => {
          return [...data, [new Date(dataParsed[0].lastUpdated), dataParsed]];
        });
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
          last: 200,
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

  // useEffect(() => {
  //   getLastData();
  // }, []);

  const categories = useMemo(() => {
    return _.uniq(
      data.reduce((prev, [_, dataPoint]) => {
        return [...prev, ...dataPoint.map((dexData: any) => dexData.slug)];
      }, [])
    ).slice(0, 10);
  }, [data]);

  const seriesData = useMemo(() => {
    return categories.map((slug: string) => {
      return {
        name: slug,
        type: "line",
        showSymbol: false,
        labelLayout: {
          moveOverlap: "shiftY",
        },
        emphasis: {
          focus: "series",
        },
        data: data.map(([date, dataRow]) => {
          const dexData = dataRow.find((dex: any) => dex.slug === slug);
          return [
            new Date(date).getTime(),
            Number(dexData?.totalVol24h?.toFixed(2)) || 0,
          ];
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
        chart.setOption(chartOption as any);
      }
    }
  }, [seriesData]);

  return (
    <div style={{ padding: 16 }}>
      <div ref={chartRef} style={{ width: "100%", height: "600px" }} />
    </div>
  );
};

export default DexVolume;
