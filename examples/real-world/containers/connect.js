import {connect} from 'react-redux'

export default function connectWithReactions(mapStateToProps, mapDispatchToProps, reactions, ...args) {
    return (component) => {
        var result = connect(mapStateToProps, mapDispatchToProps, ...args)(component);
        result.reactions = reactions;
        return result;
    }
}
