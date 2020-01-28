import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import css_classes from "./highcharts_pie.module.css";
import { Link, RouteComponentProps } from 'react-router-dom';
// import { Column } from "ag-grid-community";


// extend RouteComponentProps which has types of routing related components such as history and match
interface component_props extends RouteComponentProps<any>{
  symbols: string[], 
  percentages: number[],
  amounts: number[],
  quantities: number[]

}

const PieChart: React.FC<component_props> = props => {

  let pie_data_objects = [];

  //turning props into an array of objects that works with highcharts
  for (let i = 0; i < props.symbols.length; i += 1) {
    pie_data_objects.push({
        name: props.symbols[i],
        y: props.quantities[i],
    });
  }
  

  //highcharts options
  const options: Highcharts.Options = {
    chart: {
      type: "pie"
    },
    title: {
      text: ""
    },
    legend: {
      bubbleLegend: {
          enabled: true
      }
    },
    series: [
      {
        name: "Trades",
        data: pie_data_objects as Highcharts.SeriesOptionsType[],
        size: "100%",
        innerSize: "80%",
        cursor: 'pointer',
            events: { //click on pie chart to navigate to agGrid
                click: function (event: { point: { name: string; }; }) {
                  props.history.push("/detail/" + event.point.name);
                }
            }
      }
    ] as any,
    plotOptions: {
      pie: {
          cursor: 'pointer',
          dataLabels: {
              enabled: false
          },
          showInLegend: true
      },
    },
    tooltip:{
      backgroundColor: "#000000",
      style: {
        color: "#ffffff"
      }, 
      headerFormat: '<h1 style="text-align: "center">{point.key}</h1><br><br/>'
    }
  };

  return (
    <div className={css_classes.pie_chart_main_div}>
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

