import React, { Component } from "react";
import "./App.css";
import _ from "lodash";
import PieChart from "./highcharts/highcharts_pie";
import SymbolGrid from "./agGrid/agGrid";
import NewTradeForm from "./new_trade_form/new_trade_form";
import { Route, BrowserRouter } from "react-router-dom";
import axios from "axios";
import { ClassicSpinner } from "react-spinners-kit";
import { RouteComponentProps } from 'react-router-dom';



interface IState {
  trades_data: {symbol: string, qty: number, price:number, time: string}[],
  portfolio_sorted: {symbol: string, qty: number, price:number, time:string, amount?:number, percentage?:number}[],
  symbols: string[],
  percentages: number[],
  amounts: number[],
  quantities: number[] 
}

class App extends Component<RouteComponentProps, IState> {
  // state = {
  //   trades_data: null,
  //   portfolio_sorted: null,
  //   symbols: null,
  //   percentages: null,
  //   amounts: null,
  //   quantities: null
  // };


  public state: IState;

  // TODO: THIS INITIALIZATION IS A TEMPORARY SOLUTION TO STATE INITIALIZATION PROBLEM
  constructor(props:RouteComponentProps){
    super(props);
      this.state = {
        trades_data: [{
          symbol: "GOOGL",
          qty: 621,
          price: 25.15590870261679,
          time: "3:06:07 AM"
        }],
        portfolio_sorted: [{
          symbol: "GOOGL",
          qty: 621,
          price: 25.15590870261679,
          time: "3:06:07 AM"
        }],
        symbols: [],
        percentages: [],
        amounts: [],
        quantities: []
      }
  }
    
  componentDidMount() {
    this.fetchData();
  }

  fetchData(){
    const config = { headers: {'Content-Type': 'application/json','Cache-Control' : 'no-cache'}};

    axios.get("http://localhost:5000/api/trades", config).then(response => {
      //fetch raw data which has symbol, percentage, quantity and price fields
      let trades_data:IState["portfolio_sorted"] = response.data;
      //add the amount field for each trade
      for (let trade of trades_data) {
        trade.amount = trade.qty * trade.price;
      }


      let portfolio_summed: {symbol: string, qty: number, amount:number, percentage?:number}[];
      portfolio_summed = _(trades_data)
        .groupBy("symbol")
        .map((objs, key) => {
          return {
            symbol: key,
            qty: _.sumBy(objs, "qty"),
            amount: _.sumBy(objs, "amount")
          };
        })
        .value();

      //calculate the total size of the portfolio in dollars
      let total_amount = 0;
      for (const elem of portfolio_summed) {
        total_amount = total_amount + elem.amount;
      }

      //calculate the percentage of each element in the portfolio
      for (let elem of portfolio_summed) {
        elem.percentage = (elem.amount / total_amount) * 100;
      }

      //sort the portfolio-wise values first by percentage then by the symbol name alphabetically
      let portfolio_sorted = _.orderBy(
        portfolio_summed,
        ["percentage", "symbol"],
        ["desc", "desc"]
      );

      //get arrays of values to be sent as props to highcharts
      let symbols: string[] = [...portfolio_sorted.map(x => x.symbol)];
      let percentages: number[] = [...portfolio_sorted.map(x => x.percentage)] as number[];
      let amounts: number[] = [...portfolio_sorted.map(x => x.amount)];
      let quantities: number[] = [...portfolio_sorted.map(x => x.qty)];


      // console.log("data fetcher called!");
      //update the state with raw incoming data and arrays describing the portfolio
      this.setState(
        {
          trades_data: trades_data,
          symbols: symbols,
          percentages: percentages,
          amounts: amounts,
          quantities: quantities
        }
      );
    });
  }


  render() {
    // TODO: THIS CONIDITION CHECK IS A TEMPORARY SOLUTION TO STATE INITIALIZATION PROBLEM
    if (this.state.trades_data.length !== 1) {
      return (
        <BrowserRouter>
          <div className="App">
            <h1><span>TRADE</span><span style={{ color: 'maroon' }}>49</span></h1>

            <Route
              path="/"
              exact
              render={routeProps => (
                <PieChart
                  {...routeProps}
                  symbols={this.state.symbols}
                  percentages={this.state.percentages}
                  amounts={this.state.amounts}
                  quantities={this.state.quantities}
                />
              )}
            />
            <Route
              path="/addTrade"
              exact
              render={routeProps => (
                <NewTradeForm {...routeProps} symbols={this.state.symbols} dataFetcher={this.fetchData}/>
              )}
            />
            <Route
              path="/detail/:symbol"
              exact
              render={routeProps => (
                <SymbolGrid {...routeProps} trades={this.state.trades_data} />
              )}
            />
          </div>
        </BrowserRouter>
      );
    }
    else{
      return(
      <div className="spinner">
        <ClassicSpinner 
          size={40}
          color="#686769"
          loading={true}
        />
      </div>    
      )
    }
  }
}

export default App;
