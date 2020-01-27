import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import css_classes from "./highcharts_pie.module.css";
import { Link } from 'react-router-dom';


const PieChart = props => {

  const pie_data_objects = []

  //turning props into an array of objects that works with highcharts
  for (let i = 0; i < props.symbols.length; i += 1) {
    pie_data_objects.push({
        name: props.symbols[i],
        y: props.quantities[i],
    });
  }
  

  //highcharts options
  const options = {
    chart: {
      type: "pie"
    },
    title: {
      text: "TRADE49"
    },
    legend: {
      bubbleLegend: {
          enabled: true
      }
    },
    series: [
      {
        name: "Trades",
        data: pie_data_objects,
        size: "100%",
        innerSize: "80%",
        cursor: 'pointer',
            events: { //click on pie chart to navigate to agGrid
                click: function (event) {
                  props.history.push("/detail/" + event.point.name);
                }
            }
      }
    ],
    plotOptions: {
      pie: {
          cursor: 'pointer',
          dataLabels: {
              enabled: false
          },
          showInLegend: true
      }
    }
  };

  return (
    <div className="pie_chart_main_div">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"chart"}
        options={options}
      />
      <Link to="/addTrade"><button className={css_classes.add_trade_button}>+ Add Trade</button></Link>
    </div>
  );
};

export default PieChart;

