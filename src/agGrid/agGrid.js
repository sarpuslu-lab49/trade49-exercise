import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import css_classes from "./agGrid.module.css";

class SymbolGrid extends Component {
  state = {
    col_definitions: [
      {
        headerName: "Symbol",
        field: "symbol"
      },
      {
        headerName: "Time",
        field: "time"
      },
      {
        headerName: "Quantity",
        field: "qty"
      },
      {
        headerName: "Price",
        field: "price"
      },
      {
        headerName: "Amount",
        field: "amount"
      }
    ],
    trades_for_symbol: null
  };

  componentDidMount() {
    this.setState({
      trades_for_symbol: _.orderBy(
        _.filter(this.props.trades, ["symbol", this.props.match.params.symbol]),
        ["time"],
        ["asc"]
      )
    });
  }

  exit_handler = () => {
    this.props.history.push("/");
  }

  render() {
    return (
      <div className={css_classes.centered_grid}>
        <div>
          <h1 className={css_classes.trades_for_symbol_header}>
            Trades for {this.props.match.params.symbol}
          </h1>
          <button className={css_classes.active_green_button} onClick={this.exit_handler}>Exit</button>
        </div>

        <div className="ag-theme-balham">
          <AgGridReact
            columnDefs={this.state.col_definitions}
            rowData={this.state.trades_for_symbol}
            domLayout="autoHeight"
            rowHeight="50"
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default withRouter(SymbolGrid);
