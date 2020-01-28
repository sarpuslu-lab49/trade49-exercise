import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
// import {Grid, GridOptions} from "@ag-grid-community/all-modules";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import css_classes from "./agGrid.module.css";
import { RouteComponentProps } from "react-router-dom";

interface state_type {
  trades_for_symbol: {
    symbol: string;
    qty: number;
    price: number;
    time: string;
  }[];
}

interface Props_from_parent {
  trades: { symbol: string; qty: number; price: number; time: string }[];
}

interface Routing_props {
  symbol: string;
}

type Props = Props_from_parent & RouteComponentProps<Routing_props>;

class SymbolGrid extends React.Component<Props, state_type> {
  // state = {
  //   col_definitions: [
  //     {
  //       headerName: "Symbol",
  //       field: "symbol"
  //     },
  //     {
  //       headerName: "Time",
  //       field: "time"
  //     },
  //     {
  //       headerName: "Quantity",
  //       field: "qty"
  //     },
  //     {
  //       headerName: "Price",
  //       field: "price"
  //     },
  //     {
  //       headerName: "Amount",
  //       field: "amount"
  //     }
  //   ],
  //   trades_for_symbol: null
  // };

  // state = {
  //   trades_for_symbol: ""
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      trades_for_symbol: [
        {
          symbol: "GOOGL",
          qty: 621,
          price: 25.15590870261679,
          time: "3:06:07 AM"
        }
      ]
    };
  }

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
  };

  render() {
    const col_definitions = [
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
    ];
    return (
      <div className={css_classes.centered_grid}>
        <div className={css_classes.above_the_grid}>
          <h1 className={css_classes.trades_for_symbol_header}>
            Trades for {this.props.match.params.symbol}
          </h1>
          <button
            className={css_classes.active_green_button}
            onClick={this.exit_handler}
          >
            Exit
          </button>
        </div>

        <div className="ag-theme-balham">
          <AgGridReact
            columnDefs={col_definitions}
            rowData={this.state.trades_for_symbol}
            domLayout="autoHeight"
            rowHeight={50}
          ></AgGridReact>
        </div>
      </div>
    );
  }
}

export default withRouter(SymbolGrid);
