import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Autosuggest from 'react-autosuggest';
import { debounce } from 'throttle-debounce';
import ISearchResults from './ISearchResults';


export interface IAutoCompleteProperties {
    onChange: (searchResults: ISearchResults) => void;
    value: string;
    atoToken: string;
}

export class autoComplete extends React.Component<IAutoCompleteProperties> {
    constructor(props: IAutoCompleteProperties) {
        super(props);
        this.state = {
            value: this.props.value,
            suggestions: []
        }

    }

    state = {
        value: this.props.value,
        suggestions:[]
    }

    public render(): JSX.Element {
        return (
            <React.Fragment>             
                {this.renderContol()}
            </React.Fragment>
        );
    }

    componentWillMount() {
        this.onSuggestionsFetchRequested = debounce(
            500,
            this.onSuggestionsFetchRequested
        )
    }

    //@ts-ignore 
    renderSuggestion = suggestion => {
        return (
            <div className="result">
                <div>{suggestion.Name}</div>
                <div className="abnCode">{suggestion.Abn}</div>
            </div>
        )
    }

    //@ts-ignore 
    onSuggestionsFetchRequested = async ({ value }) => {

        
        var proxyUrl = "https://cors-anywhere.herokuapp.com/";
        var targetUrl = "https://abr.business.gov.au/json/MatchingNames.aspx?name=" + value + "&maxResults=10&callback=callback&guid=" + this.props.atoToken+"";

        const response = await fetch(proxyUrl + targetUrl

        );
        const body = await response.text();
        let bodystr = body.substring(9, body.length - 1);

        let entities = JSON.parse(bodystr).Names;
        this.setState({ suggestions: entities })
  
    }

    //@ts-ignore 
    onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
          
        const selectedAbn: ISearchResults = { abn:suggestion.Abn, company:suggestion.Name} ;
        this.props.onChange(selectedAbn);
    }



    //@ts-ignore 
    onChange = (event, { newValue }) => {
        this.setState({ value: newValue })
    }

    onSuggestionsClearRequested = () => {
        this.setState({ suggestions: [] })
    }

    renderContol(): JSX.Element  {
        const { value, suggestions } = this.state

        const inputProps = {
            placeholder: 'Please type company name',
            value: value,
            onChange: this.onChange
        }


        return (
            <div className="App">
                <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={suggestion => suggestion.Name}
                    renderSuggestion={this.renderSuggestion}
                    onSuggestionSelected={this.onSuggestionSelected }
                    inputProps={inputProps}                    
                    
                />
            </div>
        )
    }
}