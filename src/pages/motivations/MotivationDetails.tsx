import { AuthContext } from "@/auth";
import { Motivation, MotivationActor, Principle } from "@/types";
import { useState, useContext, useEffect } from "react";
import { Alert, Button, Col, ListGroup, Row } from "react-bootstrap";

import { FaFile, FaUser, FaPlus, FaExclamationTriangle } from "react-icons/fa";

import { useParams, useNavigate } from "react-router-dom";
import {
  useGetAllActors,
  useGetAllPrinciples,
  useGetMotivation,
} from "@/api/services/motivations";
import { MotivationActorModal } from "./components/MotivationActorModal";
import { MotivationModal } from "./components/MotivationModal";
import { MotivationPrincipleModal } from "./components/MotivationPrincipleModal";

export default function MotivationDetails() {
  const navigate = useNavigate();
  const params = useParams();

  const { keycloak, registered } = useContext(AuthContext)!;

  const [motivation, setMotivation] = useState<Motivation>();
  const [availableActors, setAvailableActors] = useState<MotivationActor[]>([]);
  const [availablePrinciples, setAvailablePrinciples] = useState<Principle[]>(
    [],
  );
  const [showAddActor, setShowAddActor] = useState(false);
  const [showAddPrinciple, setShowAddPrinciple] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const { data: motivationData } = useGetMotivation({
    id: params.id!,
    token: keycloak?.token || "",
    isRegistered: registered,
  });

  const {
    data: actorData,
    fetchNextPage: actorFetchNextPage,
    hasNextPage: actorHasNextPage,
  } = useGetAllActors({
    size: 5,
    token: keycloak?.token || "",
    isRegistered: registered,
  });

  const {
    data: priData,
    fetchNextPage: priFetchNextPage,
    hasNextPage: priHasNextPage,
  } = useGetAllPrinciples({
    size: 5,
    token: keycloak?.token || "",
    isRegistered: registered,
  });

  useEffect(() => {
    // gather all principles in one array
    let tmpPri: Principle[] = [];
    const mtvPrinciples =
      motivation?.principles.map((item) => {
        return item.id;
      }) || [];

    // iterate over backend pages and gather all items in the principles array
    if (priData?.pages) {
      priData.pages.map((page) => {
        tmpPri = [...tmpPri, ...page.content];
      });
      if (priHasNextPage) {
        priFetchNextPage();
      }
    }
    setAvailablePrinciples(
      tmpPri.filter((item) => !mtvPrinciples.includes(item.id)),
    );
  }, [priData, priHasNextPage, priFetchNextPage, motivation]);

  useEffect(() => {
    // gather all actors in one array
    let tmpAct: MotivationActor[] = [];
    const mtvActors =
      motivation?.actors.map((item) => {
        return item.id;
      }) || [];

    // iterate over backend pages and gather all items in the actors array
    if (actorData?.pages) {
      actorData.pages.map((page) => {
        tmpAct = [...tmpAct, ...page.content];
      });
      if (actorHasNextPage) {
        actorFetchNextPage();
      }
    }
    setAvailableActors(tmpAct.filter((item) => !mtvActors.includes(item.id)));
  }, [actorData, actorHasNextPage, actorFetchNextPage, motivation]);

  useEffect(() => {
    setMotivation(motivationData);
  }, [motivationData]);

  return (
    <div className="pb-4">
      <div className="cat-view-heading-block row border-bottom">
        <MotivationPrincipleModal
          motivationPrinciples={availablePrinciples}
          id={motivation?.id || ""}
          show={showAddPrinciple}
          onHide={() => {
            setShowAddPrinciple(false);
          }}
        />
        <MotivationActorModal
          motivationActors={availableActors}
          id={motivation?.id || ""}
          show={showAddActor}
          onHide={() => {
            setShowAddActor(false);
          }}
        />
        <MotivationModal
          motivation={motivation || null}
          show={showUpdate}
          onHide={() => {
            setShowUpdate(false);
          }}
        />
        <Col>
          <h2 className="text-muted cat-view-heading ">
            Motivation Details
            {motivation && (
              <p className="lead cat-view-lead">
                Motivation id:{" "}
                <strong className="badge bg-secondary">{motivation.id}</strong>
              </p>
            )}
          </h2>
        </Col>
      </div>
      <Row className="mt-4 border-bottom pb-4">
        <Col md="auto">
          <div className="p-3 text-center">
            <FaFile size={"4rem"} className="text-secondary" />
          </div>
          <Button
            onClick={() => {
              setShowUpdate(true);
            }}
            className="btn-light border-black"
          >
            Update Details
          </Button>
        </Col>
        <Col>
          <div>
            <strong>MTV:</strong> {motivation?.mtv}
          </div>
          <div>
            <strong>Label:</strong> {motivation?.label}
          </div>
          <div>
            <div>
              <strong>Description:</strong>
            </div>
            <div>
              <small>{motivation?.description}</small>
            </div>
          </div>
          <hr />
          <div>
            <div>
              <strong>Motivation Type:</strong>
            </div>
            <div>{motivation?.motivation_type.label}</div>
          </div>
        </Col>
      </Row>
      {/* Included principles */}
      <Row className="border-bottom pb-4">
        <div className="px-5 mt-4">
          <div className="d-flex justify-content-between mb-2">
            <h4 className="text-muted cat-view-heading ">
              <FaFile className="me-2" /> Principles
            </h4>
            <Button
              variant="warning"
              onClick={() => {
                setShowAddPrinciple(true);
              }}
              disabled={availableActors.length == 0}
            >
              <FaPlus /> Add Principle
            </Button>
          </div>
          {motivation?.principles.length === 0 ? (
            <Alert variant="warning" className="text-center mx-auto">
              <h3>
                <FaExclamationTriangle />
              </h3>
              <h5>No principles connected to this motivation... </h5>
              <div>
                <span className="align-baseline">
                  Please use the button above or{" "}
                </span>
                <Button
                  variant="link"
                  className="p-0 m-0 align-baseline"
                  onClick={() => {
                    setShowAddPrinciple(true);
                  }}
                >
                  click here
                </Button>
                <span className="align-baseline"> to add new ones</span>
              </div>
            </Alert>
          ) : (
            <ListGroup className="mt-2">
              {motivation?.principles.map((item) => {
                return (
                  <ListGroup.Item key={item.id}>
                    {item.pri} - {item.label}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </div>
      </Row>
      {/* Included actors */}
      <Row>
        <div className="px-5 mt-4">
          <div className="d-flex justify-content-between mb-2">
            <h4 className="text-muted cat-view-heading ">
              <FaUser className="me-2" /> Included Actors
            </h4>
            <Button
              variant="warning"
              onClick={() => {
                setShowAddActor(true);
              }}
              disabled={availableActors.length == 0}
            >
              <FaPlus /> Add Actor
            </Button>
          </div>
          {motivation?.actors.length === 0 ? (
            <Alert variant="warning" className="text-center mx-auto">
              <h3>
                <FaExclamationTriangle />
              </h3>
              <h5>No actors included in this motivation... </h5>
              <div>
                <span className="align-baseline">
                  Please use the button above or{" "}
                </span>
                <Button
                  variant="link"
                  className="p-0 m-0 align-baseline"
                  onClick={() => {
                    setShowAddActor(true);
                  }}
                >
                  click here
                </Button>
                <span className="align-baseline"> to add new ones</span>
              </div>
            </Alert>
          ) : (
            <ListGroup className="mt-2">
              {motivation?.actors.map((item) => {
                return (
                  <ListGroup.Item key={item.id}>
                    {item.act} - {item.label}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </div>
      </Row>
      <div className="mt-4">
        <Button
          variant="secondary"
          onClick={() => {
            navigate(-1);
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
}