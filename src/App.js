import React, { Component } from "react";
import "./App.css";
import _ from "lodash";
import PieChart from "./highcharts/highcharts_pie.js";
import SymbolGrid from "./agGrid/agGrid.js";
import NewTradeForm from "./new_trade_form/new_trade_form.js";
import { Route, BrowserRouter } from "react-router-dom";
import axios from "axios";
import { ClassicSpinner } from "react-spinners-kit";


class App extends Component {
  state = {
    trades_data: null,
    portfolio_sorted: null,
    symbols: null,
    percentages: null,
    amounts: null,
    quantities: null
  };



  componentDidMount() {
    axios.get("http://localhost:5000/api/trades").then(response => {
      //fet raw data which has symbol, percentage, quantity and price fields
      let trades_data = response.data;
      //add the amount field for each trade
      for (let trade of trades_data) {
        trade.amount = trade.qty * trade.price;
      }

      // console.log("trades_data was set");
      // console.log(trades_data);

      //group by symbols and sum quantities and amounts to get porfolio values
      let portfolio_summed = _(trades_data)
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
      let symbols = [...portfolio_sorted.map(x => x.symbol)];
      let percentages = [...portfolio_sorted.map(x => x.percentage)];
      let amounts = [...portfolio_sorted.map(x => x.amount)];
      let quantities = [...portfolio_sorted.map(x => x.qty)];

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
    if (this.state.trades_data) {
      return (
        <BrowserRouter>
          <div className="App">
            <h1>TRADE49</h1>

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
                <NewTradeForm {...routeProps} symbols={this.state.symbols} />
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
          style={{width: "300px"}}
        />
      </div>    
      // <MoonLoader/>
      )
    }
  }
}

export default App;
