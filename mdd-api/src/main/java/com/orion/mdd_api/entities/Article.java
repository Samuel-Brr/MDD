package com.orion.mdd_api.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ARTICLES")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "theme_id", nullable = false)
    private Theme theme;

    private String titre;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "auteur_id", nullable = false)
    private User auteur;

    @Lob
    private String contenu;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL)
    private List<Commentaire> commentaires;

    @JsonIgnore
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @JsonProperty("date")
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Article(String titre, String contenu) {
        this.titre = titre;
        this.contenu = contenu;
    }

    @JsonProperty("theme")
    public String getThemeTitle() {
        return theme.getTitre();
    }

    @JsonProperty("auteur")
    public String getAuteurName() {
        return auteur.getName();
    }

    public void addCommentaire(Commentaire commentaire) {
        commentaires.add(commentaire);
    }
}
