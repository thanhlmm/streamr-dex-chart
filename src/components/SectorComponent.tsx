import { useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import { init, getInstanceByDom, ECharts } from "echarts";
import { gql } from "graphql-request";
import graphQLClient from "../lib/hasura";

const query = gql`
  query SectorComponent {
    sectors_component(limit: 50, order_by: { timestamp: desc }) {
      timestamp
      Identity_marketCap
      AMM_marketCap
      AMM_marketVolume
      Asset_Management_marketCap
      Asset_Management_marketVolume
      DAO_marketCap
      DAO_marketVolume
      Derivatives_marketCap
      Derivatives_marketVolume
      Fan_Token_marketCap
      Fan_Token_marketVolume
      Filesharing_marketCap
      Filesharing_marketVolume
      Identity_marketVolume
      Interoperability_marketCap
      Interoperability_marketVolume
      Lending_Borrowing_marketCap
      Lending_Borrowing_marketVolume
      Memes_marketCap
      Memes_marketVolume
      Metaverse_marketCap
      Metaverse_marketVolume
      Oracles_marketCap
      Oracles_marketVolume
      Play_To_Earn_marketCap
      Play_To_Earn_marketVolume
      Protocol_Owned_Liquidity_marketCap
      Protocol_Owned_Liquidity_marketVolume
      Stablecoin_marketCap
      Stablecoin_marketVolume
      Synthetics_marketCap
      Synthetics_marketVolume
      Tokenized_Stock_marketCap
      Tokenized_Stock_marketVolume
      Wrapped_Tokens_marketCap
      Wrapped_Tokens_marketVolume
      Yearn_Partnerships_marketCap
      Yearn_Partnerships_marketVolume
      Yield_Aggregator_marketCap
      Yield_Aggregator_marketVolume
      Yield_Farming_marketCap
      Yield_Farming_marketVolume
    }
  }
`;

const option = {
  legend: {
    type: "scroll",
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
  toolbox: {
    show: true,
    top: 20,
    feature: {
      magicType: {
        type: ["line", "bar", "stack"],
      },
    },
  },
  xAxis: {
    type: "time",
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
  },
};

const MAX_DATAPOINT = 50;

const SectorComponent = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState<any[]>([]);
  const [dexes, setDexes] = useState<any[]>([]);

  useEffect(() => {
    graphQLClient.request(query).then((response) => {
      setData(response.sectors_component);
    });
  }, []);

  const dataset = useMemo(() => {
    console.log(data);
    const output = {
      dimensions: ["timestamp", ...Object.keys(data?.[0] || {})],
      source: data,
    };

    return output;
  }, [data]);

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current);
      chart.showLoading();
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
      const metricList = Object.keys(data?.[0] || {});
      const marketCapList = metricList.filter((name) =>
        name.includes("marketCap")
      );
      const marketVolList = metricList.filter((name) =>
        name.includes("marketVolume")
      );
      const chartOption = {
        ...option,
        dataset,
        series: [
          ...marketCapList.map((component) => {
            return {
              type: "line",
              seriesLayoutBy: "row",
              name: component.replace("_marketCap", ""),
              showSymbol: false,
              emphasis: {
                focus: "series",
              },
              encode: {
                x: "timestamp",
                y: [component],
              },
            };
          }),
          // ...marketVolList.map((component) => {
          //   return {
          //     type: "bar",
          //     seriesLayoutBy: "row",
          //     name: component,
          //     encode: {
          //       x: "timestamp",
          //       y: [component],
          //     },
          //   };
          // }),
        ],
      };

      console.log(chartOption);
      if (chart) {
        chart.hideLoading();
        chart.setOption(chartOption as any);
      }
    }
  }, [dataset]);

  return (
    <div style={{ padding: 16 }}>
      <div ref={chartRef} style={{ width: "100%", height: "600px" }} />
    </div>
  );
};

export default SectorComponent;
