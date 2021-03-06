import { expect } from 'chai';

import * as commutable from 'commutable';

import {
  loadNotebook,
  updateExecutionCount,
  newCellAfter,
} from '../../src/reducers/document';

import {
  dummyJSON,
  dummyCommutable,
} from '../dummy-nb';

describe('loadNotebook', () => {
  it('converts a JSON notebook to our commutable notebook and puts in state', () => {
    const state = loadNotebook({}, { data: dummyJSON });
    expect(state.notebook.get('nbformat')).to.equal(4);
  });
});

describe('updateExecutionCount', () => {
  it('updates the execution count by id', () => {
    const originalState = {
      notebook: commutable.appendCell(dummyCommutable, commutable.emptyCodeCell),
    };

    const id = originalState.notebook.get('cellOrder').last();

    const action = {
      id,
      count: 42,
    };

    const state = updateExecutionCount(originalState, action);
    expect(state.notebook.getIn(['cellMap', id, 'execution_count'])).to.equal(42);
  });
});

describe('newCellAfter', () => {
  it('creates a brand new cell after the given id', () => {
    const originalState = {
      notebook: commutable.appendCell(dummyCommutable, commutable.emptyCodeCell),
    };
    const id = originalState.notebook.get('cellOrder').last();

    const action = {
      id,
      cellType: 'markdown',
    };

    const state = newCellAfter(originalState, action);
    expect(state.notebook.get('cellOrder').size).to.equal(4);
    const cellID = state.notebook.get('cellOrder').last();
    const cell = state.notebook.getIn(['cellMap', cellID]);
    expect(cell.get('cell_type')).to.equal('markdown');
  });
});
