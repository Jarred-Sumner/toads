import React from "react";
import { COLORS } from "Toads/lib/colors";
import { SPACING } from "Toads/lib/spacing";
import { Spacer } from "../Spacer";
import { Post } from "../Post";
import { Query } from "react-apollo";
import { Queries } from "Toads/Queries";
import { isInitialLoading } from "../ApolloProvider";
import { Spinner } from "../Spinner";
import _ from "lodash";
import { Text } from "../Text";

class ViewThread extends React.PureComponent {
  render() {
    const { thread, board, colorScheme } = this.props;

    return (
      <div className="Container">
        <div className="PageWrapper PostWrapper" key={thread.id}>
          <Spacer height={SPACING.large} />
          <Post
            colorScheme={colorScheme}
            board={board}
            post={thread}
            comments={thread.replies}
          />
          <Spacer height={SPACING.large} />
        </div>

        <style jsx>{`
          .PostWrapper {
            width: 100%;
            border-bottom: 1px solid ${COLORS.offwhite};
          }

          .PageWrapper {
            display: block;
            padding-left: ${SPACING.huge}px;
          }
        `}</style>
      </div>
    );
  }
}

export const ViewThreadContainer = ({ board, colorScheme, ...otherProps }) => {
  return (
    <Query query={Queries.ViewThread} variables={{ id: board.id }}>
      {({ data, networkStatus }) => {
        const thread = _.get(data, "Board.thread");
        if (thread) {
          return (
            <ViewThread
              colorScheme={colorScheme}
              board={board}
              {...otherProps}
            />
          );
        } else if (
          !thread &&
          networkStatus === isInitialLoading(networkStatus)
        ) {
          return <Spinner />;
        } else {
          return (
            <Text size="14px" weight="bold">
              Something bad happened!
            </Text>
          );
        }
      }}
    </Query>
  );
};

export default ViewThreadContainer;
