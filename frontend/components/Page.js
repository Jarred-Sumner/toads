import React from "react";
import ReactTooltip from "react-tooltip";
import { COLORS } from "../lib/colors";
import { MOBILE_BEAKPOINT } from "../lib/mobile";
import { SPACING } from "../lib/spacing";
import { AlertHost } from "./Alert";
import { NavHeader } from "./NavHeader";
import { Spacer } from "./Spacer";
import { Text } from "./Text";
import { Router } from "Toads/routes";
import { GITHUB_REPO_URL } from "config";
import { ImagePreviewProvider, ImagePreviewViewer } from "./ImagePreview";
import dynamic from "next/dynamic";
import moment from "moment";
import { GreatResetCountdown } from "./PageHeader";

const DesktopChat = dynamic(import("./Chat/DesktopChat"), {
  ssr: false
});

// import Headroom from "react-headroom";

export class Page extends React.Component {
  componentDidMount() {
    const orignialRouteChangeComplete = Router.onRouteChangeComplete;

    Router.onRouteChangeComplete = url => {
      ReactTooltip.rebuild();

      if (orignialRouteChangeComplete) {
        return orignialRouteChangeComplete(url);
      }
    };
  }

  render() {
    const { children, renderSubheader, board } = this.props;

    return (
      <article className="Page">
        <AlertHost />
        {renderSubheader && renderSubheader()}

        <ImagePreviewProvider>
          <main className="PageContainer">
            {children}
            <ImagePreviewViewer />
          </main>
        </ImagePreviewProvider>

        <footer>
          {board && (
            <div className="MobileOnly">
              <Spacer height={SPACING.normal} />
              <GreatResetCountdown
                color={COLORS.gray}
                date={moment(board.expires_at).toDate()}
              />
              <Spacer height={SPACING.normal} />
            </div>
          )}

          <div className="FooterContent">
            <Text size="12px" color={COLORS.medium_white}>
              Toads is{" "}
              <a href={GITHUB_REPO_URL} target="_blank">
                open-source software
              </a>
            </Text>
          </div>

          <div className="FooterContent">
            <a
              href={`${GITHUB_REPO_URL}/commits/${GIT_COMMIT}`}
              target="_blank"
            >
              <Text size="12px" color={COLORS.medium_white}>
                v{GIT_COMMIT}
              </Text>
            </a>
          </div>
        </footer>

        <DesktopChat board={board} />
        <ReactTooltip />

        <style jsx>{`
          .PageContainer,
          .Page {
            width: 100%;
            height: auto;
            min-height: 100%;
          }

          .Page {
            display: flex;
            align-self: flex-start;
            flex-direction: column;
          }

          .Page {
            background-color: ${COLORS.background};
          }

          footer {
            margin-top: auto;
            width: 100%;
            padding: ${SPACING.large}px ${SPACING.huge}px;
            display: flex;
            justify-content: space-between;
          }

          footer a {
            color: inherit;
          }

          .FooterContent {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          footer .MobileOnly {
            flex-direction: column;
            color: ${COLORS.gray};
          }

          footer {
            flex-direction: column;
          }

          @media (max-width: ${MOBILE_BEAKPOINT}px) {
            footer {
              padding: ${SPACING.small}px;
              align-items: center;
              margin-bottom: ${SPACING.large}px;
            }
          }
        `}</style>
      </article>
    );
  }
}
