import shallowEqual from 'fbjs/lib/shallowEqual';

export default (that, prevProps, prevState, prevContext) => {
  // console.log('Changed', that, prevState, prevProps, prevContext);
  const diffs = {
    state: [],
    props: [],
    context: []
  };

  if (prevState) {
    Object.keys(Object.assign({}, prevState, that.state)).forEach(d => {
      if (!shallowEqual(prevState[d], that.state[d])) {
        if (!diffs.state.length) {
          diffs.state.push('State');
        }
        diffs.state.push({ key: d, prev: prevState[d], actual: that.state[d] });
      }
    });
  }

  if (prevProps) {
    Object.keys(Object.assign({}, prevProps, that.props)).forEach(d => {
      if (!shallowEqual(prevProps[d], that.props[d])) {
        if (!diffs.props.length) {
          diffs.props.push('Props');
        }
        diffs.props.push({ key: d, prev: prevProps[d], actual: that.props[d] });
      }
    });
  }

  if (prevContext) {
    Object.keys(Object.assign({}, prevContext, that.context)).forEach(d => {
      if (!shallowEqual(prevContext[d], that.context[d])) {
        if (!diffs.context.length) {
          diffs.context.push('Context');
        }

        if (prevContext[d].prototype !== that.context[d].prototype) {
          console.log(prevContext[d]); //eslint-disable-line no-console
        }

        diffs.context.push({ key: d, prev: prevContext[d], actual: that.context[d] });
      }
    });
  }

  Object.keys(diffs).forEach(d => {
    if (diffs[d].length) {
      diffs[d].forEach(e => {
        if (e.key) {
          console.log(`{e.key}\n    Actual: ${e.actual}\n    Prev: ${e.prev}`); //eslint-disable-line no-console
        }
        else {
          console.log(`*** ${e} ***`); //eslint-disable-line no-console
        }
      });
    }
  });
};
