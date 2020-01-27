import React, { Component } from "react";
import css_classes from "./new_trade_form.module.css";

class NewTradeForm extends Component {
  state = {
    trade_form: {
      symbol: null,
      time: null,
      quantity: null,
      price: null
    },
    trade_form_filled: false
  };

  componentDidUpdate() {
    //checking if all the form fields are truthy
    let conditions_array = Object.values(this.state.trade_form);
    let conditions_all_true = conditions_array.every((elem)=>{return elem})

    //based on the conditions set a flag to activate or deactivate submit buttons
    if (conditions_all_true && !this.state.trade_form_filled
    ) {
      this.setState({ trade_form_filled: true });
    }
    if (!conditions_all_true && this.state.trade_form_filled){
      this.setState({ trade_form_filled: false });
    }
    console.log(this.state);
  }

  save_exit_handler = () => {
    //TODO: MAKE A POST REQUEST WITH THE FORM INPUT
    this.props.history.push("/");
  };

  save_add_another_handler = () => {
    //TODO: MAKE A POST REQUEST WITH THE FORM INPUT
    this.props.history.push("/addTrade");
  };

  exit_handler = () => {
    this.props.history.push("/");
  };

  inputChangedHandler = (event, inputIdentifier) => {
    //create a copy of the current state trade_form
    const updated_trade_form = {
      ...this.state.trade_form
    };

    //update that copy
    updated_trade_form[inputIdentifier] = event.target.value;

    //update the state trade_form
    this.setState(() => {
      this.state.trade_form = updated_trade_form;
    });

    //checking if all the form fields are truthy, set a flag to render the color of submit buttons
    if (
      this.state.trade_form.symbol &&
      this.state.trade_form.time &&
      this.state.trade_form.quantity &&
      this.state.trade_form.price
    ) {
      // this.setState(() => { this.state.trade_form_filled = true });
      this.setState({ trade_form_filled: true });
    } else {
      // this.setState(() => { this.state.trade_form_filled = false });
      this.setState({ trade_form_filled: false });
    }
    // console.log(this.state);
  };

  render() {
    //generate possible ticker options for the form selection dropdown
    const symbol_dropdown_options = this.props.symbols.map(symbol => {
      return (
        <option value={symbol} key={symbol}>
          {symbol}
        </option>
      );
    });

    return (
      <div className={css_classes.new_trade_form}>
        <form>
          <label for="symbols" style={{display:"block"}}>Symbol</label>
          <select
            name="symbols"
            placeholder="Select"
            className={css_classes.input_box}
            onChange={event => this.inputChangedHandler(event, "symbol")}
          >
            <option value="" disabled selected>
              Select
            </option>
            {symbol_dropdown_options}
          </select>
          

          <label for="execution_time" style={{display:"block"}}>Time</label>
          <input
            name="execution_time"
            type="text"
            placeholder="Execution Time e.g 00:00:00 AM"
            className={css_classes.input_box}
            onChange={event => this.inputChangedHandler(event, "time")}
          ></input>
          
          <label for="num_shares" style={{display:"block"}}>Quantity</label>
          <input
            name="num_shares"
            type="numeric"
            placeholder="Number of shares"
            className={css_classes.input_box}
            onChange={event => this.inputChangedHandler(event, "quantity")}
          ></input>

          <label for="price_per_share" style={{display:"block"}}>Price</label>
          <input
            name="price_per_share"
            type="numeric"
            step="any"
            placeholder="Price per share"
            className={css_classes.input_box}
            onChange={event => this.inputChangedHandler(event, "price")}
          ></input>

          <br></br>

          <button
            onClick={this.save_exit_handler}
            className={
              this.state.trade_form_filled
                ? css_classes.active_green_button
                : css_classes.inactive_gray_button
            }
          >
            Save & Exit
          </button>

          <button
            onClick={this.save_add_another_handler}
            className={
              this.state.trade_form_filled
                ? css_classes.active_green_button
                : css_classes.inactive_gray_button
            }
          >
            Save & Add Another
          </button>

          <button
            onClick={this.exit_handler}
            className={css_classes.active_green_button}
          >
            Exit
          </button>

        </form>
      </div>
    );
  }
}

export default NewTradeForm;
