import { ErrorPage, LoadingPage } from "components/LoadingPage";
import { BoardHeader } from "components/Post/BoardHeader";
import { ListThreadsContainer } from "components/Post/ListThreads";
import _ from "lodash";
import { withRouter } from "next/router";
import React from "react";
import { compose, Query } from "react-apollo";
import {
  isError,
  isInitialLoading,
  withApollo
} from "../components/ApolloProvider";
import { Page } from "../components/Page";
import { Spacer } from "../components/Spacer";
import { SPACING } from "../lib/spacing";
import { Queries } from "../Queries";

class ViewBoardPage extends React.Component {
  state = {
    showCreatePost: false
  };

  handleHideCreatePost = () => this.setState({ showCreatePost: false });
  handleShowCreatePost = () => {
    this.setState({ showCreatePost: true }, () => {
      this.dropZoneRef.open();
    });
  };

  setDropzoneRef = dropZoneRef => (this.dropZoneRef = dropZoneRef);

  renderHeader = () => (
    <BoardHeader
      board={this.props.board}
      identity={this.props.identity}
      hideCreatePost={this.handleHideCreatePost}
      showCreatePost={this.handleShowCreatePost}
      isCreatePostVisible={this.state.showCreatePost}
      dropZoneRef={this.setDropzoneRef}
    />
  );

  render() {
    const { board } = this.props;
    const { color_scheme: colorScheme } = board;

    return (
      <Page renderSubheader={this.renderHeader}>
        <Spacer height={SPACING.large} />
        <ListThreadsContainer
          identity={board.identity}
          board={board}
          colorScheme={colorScheme}
        />
      </Page>
    );
  }
}

export const ViewBoardPageContainer = compose(
  withApollo,
  withRouter
)(({ url, ...otherProps }) => {
  return (
    <Query
      notifyOnNetworkStatusChange
      fetchPolicy="cache-and-network"
      query={Queries.ViewBoard}
      variables={{ id: url.query.board }}
    >
      {({ data = null, networkStatus }) => {
        const board = data ? _.get(data, "Board") : null;
        if (!board && isInitialLoading(networkStatus)) {
          return <LoadingPage>Toading /{url.query.board}/...</LoadingPage>;
        } else if (!board && isError(networkStatus)) {
          return <ErrorPage />;
        } else if (board) {
          return (
            <ViewBoardPage
              {...otherProps}
              board={board}
              identity={board.identity}
              networkStatus={networkStatus}
            />
          );
        } else {
          return <ErrorPage>Four Oh Four.</ErrorPage>;
        }
      }}
    </Query>
  );
});

export default ViewBoardPageContainer;
