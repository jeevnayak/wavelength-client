import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  graphql,
} from 'react-apollo';
import {
  ListView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  LoadingScreen,
  Row,
  RowTitle,
  Screen,
  UserPicture,
} from '../ui/Elements';

class PartnershipScreen extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (game1, game2) => (
        game1.id !== game2.id
      )
    });
    this.dataSource_ = dataSource;
  }

  render() {
    if (this.props.loading) {
      return <LoadingScreen />;
    }

    this.dataSource_ = this.dataSource_.cloneWithRows(
      this.props.partnership.games);
    let listView;
    if (this.dataSource_.getRowCount() > 0) {
      listView = <ListView
        dataSource={this.dataSource_}
        renderRow={(game) => this.renderGameRow_(game)} />;
    }

    return (
      <Screen>
        <TouchableHighlight onPress={this.props.navigator.pop}>
          <Text>Back</Text>
        </TouchableHighlight>
        {listView}
      </Screen>
    );
  }

  renderGameRow_(game) {
    return <Row onPress={() => this.onPressGameRow_(game)}>
      <RowTitle text={game.id} />
    </Row>;
  }

  onPressGameRow_(game) {
    console.log(game);
  }
}

const query = gql`
  query query($partnershipId: Int!, $currentUserId: String!) {
    partnership(id: $partnershipId) {
      id
      partner(userId: $currentUserId) {
        id
        name
      }
      games {
        id
        word
        isCluer(userId: $currentUserId)
        clues
        guesses
        replayed
      }
    }
  }
`;

export default graphql(query, {
  props: ({ ownProps, data: { loading, partnership, refetch } }) => ({
    loading: loading,
    partnership: partnership,
  }),
})(PartnershipScreen);
